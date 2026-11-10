# shared process

The `shared-process` is a NodeJS process that is used for sending files to the Browser via WebSockets.

- `shared-process` is created by the `web` process
- `shared-process` launches the `extension-host`
- `shared-process` communicates with `renderer-worker` via WebSockets

## Static export bundle mode

`exportStatic({ root, extensionPath, bundleMode: true })` creates
`renderer-process.bundled.js`. The renderer process, renderer worker, editor
worker, extension-management worker, icon-theme worker, cache worker and explorer
worker share the renderer thread, with separate module state and MessagePorts.
Other workers, including extension workers, remain independent. Omit `bundleMode`
or set it to `false` to retain separate core workers.

The export uses the existing `PATH_PREFIX` environment variable. Bundling happens
at export time; the browser does not evaluate generated source or require a bundler.
Sharing a thread reduces worker contexts but can make long-running core operations
block rendering. Memory and responsiveness depend on the workload.

<!--
For example, this is how readFile is implemented in renderer-worker:

```js
export const readFile = (path) => {
  return SharedProcess.invoke(/* readFile */ 101, /* path */ path)
}
```

This will be send to the shared-process

```json
{
  "jsonrpc": "2.0",
  "method": 101,
  "params": ["/tmp/index.css"],
  "id": 19
}
```

And the shared-process will send back

````json
{
  "jsonrpc": "2.0",
  "result": "h1 {\n font-size: 20px;\n}\n",
  "id": 19
}
``` -->

```

```
