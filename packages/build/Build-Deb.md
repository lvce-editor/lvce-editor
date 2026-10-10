## Deb

Generate a `.deb` file that can be installed with the `apt` package manager.

## Build

```sh
node bin/build.js --target=electron-deb --force
```

Enable `asar` packaging explicitly:

```sh
node bin/build.js --target=electron-builder-deb --force --asar
```

The `electron-deb` target does not support `--asar`; use `electron-builder-deb` when ASAR packaging is required.

ASAR builds archive the Electron entry point. The shared Node process, static files, native modules, and extension tools stay in `app.asar.unpacked` because they require filesystem paths. Omitting `--asar` or passing `--no-asar` keeps the application unpacked.

## Try out

```sh
sudo dpkg -i .tmp/releases/lvce-oss-amd64.deb
```

## Troubleshooting

When installing the deb locally, it might show the error `.deb' couldn't be accessed by user '_apt'. - pkgAcquire::Run (13: Permission denied)`. As a workaround, run `sudo chown _apt /var/lib/update-notifier/package-data-downloads/partial/` (see https://askubuntu.com/questions/954862/couldnt-be-accessed-by-user-apt-pkgacquirerun-13-permission-denied)

## Linting

Use [lintian](http://manpages.ubuntu.com/manpages/trusty/man1/lintian.1.html) to check the deb for errors/warnings
