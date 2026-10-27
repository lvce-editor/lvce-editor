# @lvce-editor/server

The server process is a nodejs process that

- runs a static file server that serves the html, css and javascript to the browser
- can accept WebSocket connections, it sends the WebSocket connection to `shared-process`
- spawns the `shared-process`

The Electron CLI and desktop main process read persistent command-line arguments from `argv.json` in the application configuration directory. On Linux, this is `$XDG_CONFIG_HOME/lvce-oss/argv.json`, or `~/.config/lvce-oss/argv.json` when `XDG_CONFIG_HOME` is unset. Use JSONC and the same option names as the CLI, for example:

```jsonc
{
  "link": ["/path/to/extension", "/path/to/another extension"],
  "asar": true,
  "electron-version": "44.1.2",
}
```

Configured values are applied before command-line arguments, so an explicit argument takes precedence. Set a boolean to `false` to leave a boolean option disabled. `--transient` uses isolated configuration and does not read the persistent file.

Use `--process-explorer-worker=/path/to/worker.js` to serve a local process explorer worker at runtime. Relative paths resolve from the server working directory. The last flag overrides the user preference and packaged worker URL; `--disable-custom-worker-paths` suppresses this override. Without the flag, the existing worker configuration is retained. Explicitly linked worker packages retain their existing precedence.

Use `--activity-bar-worker=/path/to/worker.js` to serve a local activity bar worker at runtime. Relative paths resolve from the server working directory. The flag overrides the user preference and packaged worker URL; `--disable-custom-worker-paths` suppresses this override. Without the flag, the existing worker configuration is retained.

For local native process development, including with the published server, `--process-explorer=/path/to/processExplorerMain.ts` sets `develop.processExplorerPath` without rewriting installed packages.
