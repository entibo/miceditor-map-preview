
const puppeteer = require("puppeteer")

//const miceditorUrl = "https://entibo.github.io/miceditor/#minimal"
const miceditorUrl = "http://localhost:8080/#minimal"
console.log(`Using Miceditor at ${miceditorUrl}`)



let startTime = Date.now()

function timeLog(msg) {
  console.log(msg + ": " + (Date.now() - startTime) / 1000)
}

module.exports.screenshot = async ({xml}) => {

  startTime = Date.now()

  timeLog("Launching browser...")

  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--ignore-certificate-errors",
      "-unlimited-storage",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
    defaultViewport: {
      width: 9000,
      height: 3000,
      isLandscape: true,
    },
  })

  const page = await browser.newPage()
  const waitForNetworkIdle = networkStatus(page)
  
  page.on("pageerror", e => console.log("pageerror", e))
  page.on("error", e => console.log("error", e))

  timeLog("Browser ready")

  await page.goto(miceditorUrl, {
    waitUntil: "networkidle2",
  })

  await page.evaluate(() => {
    window.showGameGUI.set(false)
    window.showMechanics.set(false)
    window.showInvisibleGrounds.set(false)
  })

  timeLog("Page loaded")

  let loadXML = async xml => {
    let rect = JSON.parse(await page.evaluate(async xml => {
      window.xml.set(xml)
      window.importXML(xml)
      await window.tick()
      let mapBorder = document.querySelector(".mapBorder")
      let rect = mapBorder.getBoundingClientRect()
      mapBorder.style.visibility = "hidden"
      return JSON.stringify(rect)
    }, xml))
    await waitForNetworkIdle()
    return rect
  }

  timeLog("Input xml...")
  let clipRect = await loadXML(xml)
  timeLog("Input xml done!")

  let screenshot = await page.screenshot({ 
    path: "screenshot.png",
    clip: clipRect,
  })
  timeLog("Aquired screenshot !")

  await browser.close()
  timeLog("Done")

  return screenshot
}

function networkStatus(page) {
  page.on("request", onRequestStarted)
  page.on("requestfinished", onRequestFinished)
  page.on("requestfailed", onRequestFinished)
  let requests = new Set()
  function onRequestStarted(e) {
    let url = e._url
    requests.add(url)
    //console.log("Added request "+requests.size)
    listeners.forEach(({timeoutId}) => clearTimeout(timeoutId))
  }
  function onRequestFinished(e) {
    let url = e._url
    requests.delete(url)
    if(requests.size <= 0) {
      notify()
    }
    //console.log("Removed request "+requests.size)
  }

  let listeners = []
  function notify() {
    listeners.forEach(({resolve}) => resolve())
    listeners = []
  }
  return () => {
    let promise = new Promise((resolve) => {
      let timeoutId = setTimeout(resolve, 100)
      listeners.push({resolve, timeoutId})
    })
    return promise
  }
}