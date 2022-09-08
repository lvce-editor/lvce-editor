# Snap

Generate a `.snap` file that can be installed with the `snap` package manager.

## Build

```sh
node bin/build.js --target=electron-builder-snap
```

## Try out

```sh
sudo snap install ./.tmp/releases/lvce-oss.snap --devmode
```
