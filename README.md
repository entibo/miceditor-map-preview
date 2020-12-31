## Miceditor Map Preview
# Transformice map image generator

Currently hosted on heroku (free) using the [https://github.com/jontewks/puppeteer-heroku-buildpack](puppeteer-heroku-buildpack)
https://miceditor-map-preview.herokuapp.com/

### Usage:

```
POST https://miceditor-map-preview.herokuapp.com/
Content-Type: application/json
{ "xml": "<C>..." [, "raw": true] [, "width|height": number] }
```

Response is `text/plain` with the imgur link or `image/png` binary with `"raw": true`
