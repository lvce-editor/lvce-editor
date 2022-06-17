# web

The web process is a nodejs process that runs

- `web` runs a static file server that serves the html, css and javascript to the browser
- `web` can accept WebSocket connections, it sends the WebSocket connection to `shared-process`
- `web` spawns the `shared-process`
