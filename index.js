const express = require("express")
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000


const {Editor} = require("./editor-runner")

let editorPool = []
for(let i=0; i < 10; i++) {
  editorPool.push(new Editor())
}

app.get("/", (req, res) => {
  res.send(`<h4>Usage:</h4> <div>POST <span id="url"></span></div> <div>Content-Type: application/json</div> <div>{"xml": "..."}</div>
  <script>document.getElementById("url").innerHTML = document.location</script>`)
})

app.get("/hard-reload", async (req, res) => {
  res.send("Done!")
  setTimeout(() => {
    process.exit()
  })
})

app.post("/", async (req,res) => {
  if(!req.body.xml) {
    res.statusCode(400)
    res.send('POST body should look like this: {"xml":"<C></C>"}')
  }
  console.log("POST request on '/'")
  let _editor
  try {
    let intervalId = setInterval(() => {
      for(let editor of editorPool) {
        if(editor.available) {
          editor.available = false
          console.log("Using editor #"+editorPool.indexOf(editor))
          clearInterval(intervalId)
          proceed(editor)
          break
        }
      }
    }, 100)
    let proceed = async editor => {
      _editor = editor
      let buffer = await editor.screenshot(req.body)
      res.send(buffer)
    }
  } catch(e) {
    console.error("error:", e)
    res.statusCode = 500
    res.send(e.message)
    if(_editor) {
      _editor.refresh()
    }
  }
})


app.listen(port, () =>
  console.log(`Server listening on port ${port}!`),
)
