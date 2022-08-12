# renderer-worker

The `renderer-worker` runs in a browser and is a used for the logic of the application.

- `renderer-worker` is created by `renderer-process`
- `renderer-worker` and `renderer-process` can communicate via a `postMessage`
- `renderer-worker` can communicate with `shared-process` via a WebSocket (e.g. reading file from file system, ...)
