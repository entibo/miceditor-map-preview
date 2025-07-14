# Miceditor Map Preview

Generate an image of a Transformice map, rendered in [Miceditor](https://github.com/entibo/miceditor) using browser automation.

### Usage ([example](https://github.com/entibo/miceditor/blob/8066a86555/src/components/ui/menus/ScreenshotMenu.svelte#L47)):

Running `index.js` will start a web server listening for POST requests with a JSON payload:

```
POST https://miceditor-map-preview.herokuapp.com/
Content-Type: application/json
{ "xml": "<C>..." [, "raw": true] [, "width|height": number] }
```

Response is `text/plain` with the imgur link or `image/png` binary if `"raw": true` is set

~~Currently hosted on heroku (free) using the [puppeteer-heroku-buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack)  
https://miceditor-map-preview.herokuapp.com/~~
