## Miceditor Map Preview
# Transformice map image generator

### Usage:

```
POST  
Content-Type: application/json
{ "xml": "<C>..." [, "raw": true] [, "width|height": number] }
```

Response is `text/plain` with the imgur link or `image/png` binary with `"raw": true`
