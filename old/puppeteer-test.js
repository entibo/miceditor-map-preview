
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

  timeLog("Page loaded")

/*   let xml1 = `<C><P H="800" D="x_deadmeat/x_campement/feu/6.png,476,389;x_transformice/x_inventaire/17.jpg,219,95" MEDATA=";;;;-0;0::0,1,2,3:1-"/><Z><S><S T="10" X="245" Y="233" L="405" H="47" P="0,0,0.3,0,0,0,0,0"/><S T="3" X="424" Y="320" L="405" H="47" P="0,0,0.3,0,0,0,0,0"/><S T="2" X="275" Y="529" L="195" H="100" P="0,0,0,1.2,0,0,0,0"/><S T="19" X="614" Y="76" L="184" H="122" P="0,0,0.3,0,0,0,0,0"/><S T="19" X="782" Y="18" L="32" H="35" P="0,0,0.3,0,0,0,0,0"/><S T="6" X="58" Y="332" L="240" H="65" P="0,0,0.3,0.2,0,0,0,0"/><S T="0" X="39" Y="501" L="220" H="218" P="0,0,0.3,0.2,0,0,0,0"/><S T="1" X="400" Y="788" L="800" H="22" P="0,0,0,0.2,0,0,0,0"/></S><D><P X="351" Y="294" T="19" C="329cd2" P="0,0"/><P X="104" Y="210" T="1" P="0,0"/><P X="262" Y="50" T="131" C="FF0000" P="0,0"/><P X="324" Y="50" T="131" C="00F92E" P="0,0"/><P X="394" Y="48" T="131" C="003CFF" P="0,0"/><P X="147" Y="210" T="132" P="0,0"/><F X="214" Y="192"/><P X="312" Y="145" T="178" P="0,0"/><P X="497" Y="287" T="169" P="0,0"/><DS X="289" Y="198"/></D><O><O X="384" Y="166" C="22" P="0" stop=""/><O X="334" Y="395" C="22" P="0" stop=""/><O X="222" Y="445" C="208" P="0"/><O X="304" Y="455" C="40" P="0,1"/><O X="400" Y="433" C="68" P="70,0"/></O><L><JD c="FF0000,27,0.9,0" P1="34,34.5" P2="46,123.5"/><JD c="FF0000,27,0.9,0" P1="99,151.5" P2="197,139.5"/><JD c="FF0000,27,0.9,0" P1="197,139.5" P2="182,49.5"/><JD c="FF0000,27,0.9,0" P1="182,49.5" P2="94,61.5"/></L></Z></C>`
  let xml2 = `<C><P H="800" D="x_deadmeat/x_campement/feu/6.png,63,389;x_transformice/x_inventaire/17.jpg,470,95" MEDATA=";;;;-0;0::0,1,2,3:1-"/><Z><S><S T="10" X="484" Y="233" L="405" H="47" P="0,0,0.3,0,0,0,0,0"/><S T="3" X="305" Y="320" L="405" H="47" P="0,0,0.3,0,0,0,0,0"/><S T="2" X="454" Y="529" L="195" H="100" P="0,0,0,1.2,0,0,0,0"/><S T="19" X="115" Y="76" L="184" H="122" P="0,0,0.3,0,0,0,0,0"/><S T="19" X="-53" Y="18" L="32" H="35" P="0,0,0.3,0,0,0,0,0"/><S T="6" X="671" Y="332" L="240" H="65" P="0,0,0.3,0.2,0,0,0,0"/><S T="0" X="690" Y="501" L="220" H="218" P="0,0,0.3,0.2,0,0,0,0"/><S T="1" X="329" Y="788" L="800" H="22" P="0,0,0,0.2,0,0,0,0"/></S><D><P X="378" Y="294" T="19" C="329cd2" P="0,1"/><P X="625" Y="210" T="1" P="0,1"/><P X="467" Y="50" T="131" C="FF0000" P="0,1"/><P X="405" Y="50" T="131" C="00F92E" P="0,1"/><P X="335" Y="48" T="131" C="003CFF" P="0,1"/><P X="582" Y="210" T="132" P="0,1"/><F X="515" Y="192"/><P X="417" Y="145" T="178" P="0,1"/><P X="232" Y="287" T="169" P="0,1"/><DS X="440" Y="198"/></D><O><O X="345" Y="166" C="22" P="0" stop=""/><O X="395" Y="395" C="22" P="0" stop=""/><O X="507" Y="445" C="208" P="0"/><O X="425" Y="455" C="40" P="0,1"/><O X="329" Y="433" C="68" P="-70,0"/></O><L><JD c="FF0000,27,0.9,0" P1="695,34.5" P2="683,123.5"/><JD c="FF0000,27,0.9,0" P1="630,151.5" P2="532,139.5"/><JD c="FF0000,27,0.9,0" P1="532,139.5" P2="547,49.5"/><JD c="FF0000,27,0.9,0" P1="547,49.5" P2="635,61.5"/></L></Z></C>`
 */

  let inputEl = await page.$("input.text-gray-300")
  let setXML = async xml => {
    await inputEl.click({ clickCount: 3 })
    //await inputEl.type(xml)
    await page.evaluate(xml => {
      let input = document.querySelector("header input")
      input.value = xml
    }, xml)
    await inputEl.type(" ")
    await waitForNetworkIdle()

    // Triggers an error on the page; doesn't trigger the error events
    /* try {
      await page.evaluate(() => {
        window.foo(hi)
      })
    }
    catch(e) { console.log(e)} */

  }

  let svgEl = await page.$("svg .mapBorder")

  await setXML(xml)
  timeLog("Input xml...")

  let rect = JSON.parse(await page.evaluate(() => {
    document.querySelector("header").style.opacity = "0"
    document.querySelector(".playerView").style.visibility = "hidden"
    let mapBorder = document.querySelector(".mapBorder")
    mapBorder.style.visibility = "hidden"
    let rect = mapBorder.getBoundingClientRect()
    /* if(rect.y % 1 != 0) {
      let el = document.querySelector(".scene-container > svg > g")
      el.transform = el.transform + " translate(0 0.5)"
    } */
    return JSON.stringify(rect)
  }))
  console.log(rect)

  timeLog("Tweaked some css")

  let screenshot = await page.screenshot({ 
    path: "screenshot.png",
    clip: rect,
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