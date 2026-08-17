# LVCE Editor

VS Code inspired text editor that mostly runs in a webworker.

## Contributing

```sh
git clone git@github.com:lvce-editor/lvce-editor.git &&
cd lvce-editor &&
npm ci &&
npm test
```

<img alt="Static Badge" src="https://img.shields.io/badge/OSS%20hosting%20by-cloudsmith-blue?logo=cloudsmith&style=flat-square&link=https%3A%2F%2Fcloudsmith.com">

Package repository hosting is graciously provided by [Cloudsmith](https://cloudsmith.com).
Cloudsmith is the only fully hosted, cloud-native, universal package management solution, that
enables your organization to create, store and share packages in any format, to any place, with total
confidence.

## Runtime arguments

Extensions can be linked for one application run by repeating `--link`:

```sh
lvce --link /path/to/extension-one --link /path/to/extension-two
```

The Electron app and server also load JSON-with-comments runtime arguments from `argv.json`. The OSS build uses
`${XDG_CONFIG_HOME:-~/.config}/lvce-oss/argv.json`; the branded build uses the `lvce` directory instead.

```jsonc
{
  "link": ["/path/to/extension-one", "/path/to/extension-two"],
  "disable-custom-worker-paths": true
}
```

Boolean `true` values add a flag, boolean `false` values omit it, and array values repeat an argument. Arguments supplied directly when launching LVCE are added after configured arguments.
