# Build Arch Linux

Install libarchive tools (https://github.com/electron-userland/electron-builder/issues/4181#issuecomment-674413927)

## Dependencies (when building on Ubuntu)

```sh
sudo apt install -y libarchive-tools
```

## Dependencies (when building on Arch Linux)

```sh
sudo pacman -Syu libxcrypt-compat
```

## Build

```sh
node bin/build.js --target=electron-builder-arch-linux --force
```

## Try out

```sh
sudo pacman -U .tmp/releases/lvce-oss.pacman
```

## Linting

```sh
namcap -i .tmp/releases/lvce-oss.pacman
```
