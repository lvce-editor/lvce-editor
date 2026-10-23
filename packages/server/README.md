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
  "electron-version": "44.1.2"
}
```

Configured values are applied before command-line arguments, so an explicit argument takes precedence. Set a boolean to `false` to leave a boolean option disabled. `--transient` uses isolated configuration and does not read the persistent file.
