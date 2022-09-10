# @lvce-editor/server

The server process is a nodejs process that

- runs a static file server that serves the html, css and javascript to the browser
- can accept WebSocket connections, it sends the WebSocket connection to `shared-process`
- spawns the `shared-process`
