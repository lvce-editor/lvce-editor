# LVCE Editor

VS Code inspired text editor that mostly runs in a webworker.

## macOS command line

After copying `lvce.app` to `/Applications`, add its bundled launcher to a directory
on your PATH. For example, with Homebrew on Apple Silicon:

```sh
ln -s /Applications/lvce.app/Contents/Resources/app/bin/lvce /opt/homebrew/bin/lvce
lvce -v
```

The launcher supports `-v` and `--version` without opening a window. It also accepts
file paths and the other editor CLI arguments. The symlink continues to work after
replacing the app with a newer version. If the app is installed elsewhere, use its
actual path. For other setups, choose an existing writable directory on your PATH.
This requires a release that includes the macOS launcher; older DMGs do not contain it.

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
