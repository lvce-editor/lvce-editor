# shared process

The `shared-process` is a NodeJS process that is used for sending files to the Browser via WebSockets.

- `shared-process` is created by the `web` process
- `shared-process` launches the `extension-host`
- `shared-process` communicates with `renderer-worker` via WebSockets

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
