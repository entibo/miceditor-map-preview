const puppeteer = require("puppeteer")

const miceditorUrl = "https://entibo.github.io/miceditor/#minimal"
//const miceditorUrl = "http://localhost:8080/#minimal"
console.log(`Using Miceditor at ${miceditorUrl}`)

class Editor {
  constructor() {
    this.available = false
    this.refresh()
  }
  async refresh() {
    this.available = false
    if (this.editorPromise) {
      await this.close()
    }
    this.editorPromise = launchEditor()
    this.editorPromise.then(() => (this.available = true))
  }
  async screenshot(options) {
    let editor = await this.editorPromise
    this.available = false
    let buffer = await editor.screenshot(options)
    this.available = true
    return buffer
  }
  async close() {
    let editor = await this.editorPromise
    await editor.close()
  }
}
module.exports.Editor = Editor

const launchEditor = async () => {
  console.log("Launching a browser...")
  const browser = await puppeteer.launch({
    devtools: false,
    headless: true,
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
  const waitForNetworkIdle = watchNetwork(page)
  page.on("pageerror", e => console.log("pageerror", e))
  page.on("error", e => console.log("error", e))

  await page.goto(miceditorUrl, {
    waitUntil: "networkidle2",
  })

  await page.evaluate(() => {
    window.showGameGUI.set(false)
    window.showMechanics.set(false)
    window.showInvisibleGrounds.set(false)
  })

  console.log("Editor is ready")

  let loadXML = async xml => {
    let rect = JSON.parse(
      await page.evaluate(async xml => {
        // Load the map and wait for render
        window.xml.set(xml)
        window.importXML(xml)
        await window.tick()

        let mapBorder = document.querySelector(".mapBorder")
        let rect = mapBorder.getBoundingClientRect()
        mapBorder.style.visibility = "hidden"
        return JSON.stringify(rect)
      }, xml)
    )
    await waitForNetworkIdle()
    return rect
  }
  let reset = async () => {
    await page.evaluate(() => {
      window.xml.set("<C><P/><Z><S/><D/><O/><L/></Z></C>")
      window.importXML("<C><P/><Z><S/><D/><O/><L/></Z></C>")
    })
  }

  return {
    screenshot: async ({ xml }) => {
      let clipRect = await loadXML(xml)
      let buffer = await page.screenshot({ clip: clipRect })
      await reset()
      return buffer
    },
    close: async () => {
      await browser.close()
    },
  }
}

function watchNetwork(page) {
  page.on("request", onRequestStarted)
  page.on("requestfinished", onRequestFinished)
  page.on("requestfailed", onRequestFinished)
  let requests = new Set()
  function onRequestStarted(e) {
    let url = e._url
    requests.add(url)
    //console.log("Added request "+requests.size)
    listeners.forEach(({ timeoutId }) => clearTimeout(timeoutId))
  }
  function onRequestFinished(e) {
    let url = e._url
    requests.delete(url)
    if (requests.size <= 0) {
      notify()
    }
    //console.log("Removed request "+requests.size)
  }

  let listeners = []
  function notify() {
    listeners.forEach(({ resolve }) => resolve())
    listeners = []
  }
  return () => {
    let promise = new Promise(resolve => {
      let timeoutId = setTimeout(resolve, 5000)
      listeners.push({ resolve, timeoutId })
    })
    return promise
  }
}
