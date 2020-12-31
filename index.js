const express = require("express")
const cors = require("cors")
const sharp = require("sharp")
const axios = require("axios").default
const FormData = require("form-data")

const { Editor } = require("./editor-runner")

const IMGUR_CLIENT_ID = "ba8c5d881c8f203"
const port = process.env.PORT || 3000
const NUM_EDITORS = 3

let editorPool = []
for (let i = 0; i < NUM_EDITORS; i++) {
  editorPool.push(new Editor())
}

const app = express()
app.use(express.json())
app.use(cors())

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

app.post("/", async (req, res) => {
  console.log("POST request on '/'")
  console.log(req.body)
  if (!req.body.xml) {
    console.log("Invalid request body")
    res.status(400)
    res.send("Invalid request body")
    return
  }
  let _editor
  try {
    let intervalId = setInterval(() => {
      for (let editor of editorPool) {
        if (editor.available) {
          console.log("Using editor #" + editorPool.indexOf(editor))
          editor.available = false
          clearInterval(intervalId)
          proceed(editor)
          break
        }
      }
    }, 100)
    let proceed = async editor => {
      _editor = editor
      let buffer = await editor.screenshot(req.body)
      if (req.body.width || req.body.height) {
        buffer = await sharp(buffer)
          .resize(req.body.width, req.body.height, { fit: "fill" })
          .toBuffer()
      }
      if (req.body.raw) {
        res.type("png")
        res.send(buffer)
      } else {
        let imgurOutput = await uploadToImgur(buffer)
        console.log(imgurOutput)
        if (imgurOutput.success) {
          res.type("text")
          res.send(imgurOutput.link)
        } else {
          res.status(500)
          res.send(imgurOutput.error)
        }
      }
    }
  } catch (e) {
    console.error("error:", e)
    res.status(500)
    res.send(e.message)
    if (_editor) {
      _editor.refresh()
    }
  }
})

app.listen(port, () => console.log(`Server listening on port ${port}!`))

function uploadToImgur(buffer) {
  const imgurForm = new FormData()
  imgurForm.append("image", buffer)
  return axios("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      ...imgurForm.getHeaders(),
    },
    data: imgurForm,
  })
    .then(response => {
      return {
        status: response.status,
        success: response.data.success,
        link: response.data.data.link,
      }
    })
    .catch(e => {
      console.log("error:", e.response.data.status, e.response.data.data.error)
      return {
        status: e.response.data.status,
        success: false,
        error: e.response.data.data.error,
      }
    })
}
