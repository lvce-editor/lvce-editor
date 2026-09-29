# LVCE Editor

VS Code inspired text editor that mostly runs in a webworker.

## macOS command line

After copying `lvce.app` to `/Applications`, open the Command Palette and run
**Shell Command: Install 'lvce' command in PATH**. This links the bundled launcher
into `/usr/local/bin`; macOS may request administrator permission. Open a new
terminal, then run `lvce -v` to check the installed version.

The command preserves existing files and links belonging to other installations.
Running it again with the same installation is harmless. The link continues to
work when the app is replaced at the same location during an update.

The launcher supports `-v` and `--version` without opening a window, plus file paths
and the other editor CLI arguments. This requires a release containing the macOS
launcher and installation command; older releases do not include them.

## Linux Electron version selection

The Linux CLI accepts `--electron-version <version>` (or
`--electron-version=<version>`) to launch the current application resources with
another Electron release. The selected runtime is downloaded on first use and
cached under the user's cache directory, separately for each version and platform
architecture. For example, `lvce --electron-version 44.0.0 --wait` launches and
waits for Electron 44.0.0.

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
