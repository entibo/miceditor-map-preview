## Miceditor Map Preview
# Transformice map image generator

Currently hosted on heroku (free) using the [puppeteer-heroku-buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack)  
https://miceditor-map-preview.herokuapp.com/

### Usage ([example](https://github.com/entibo/miceditor/blob/8066a86555/src/components/ui/menus/ScreenshotMenu.svelte#L47)):

```
POST https://miceditor-map-preview.herokuapp.com/
Content-Type: application/json
{ "xml": "<C>..." [, "raw": true] [, "width|height": number] }
```

Response is `text/plain` with the imgur link or `image/png` binary with `"raw": true`
