## Deb

Generate a `.deb` file that can be installed with the `apt` package manager.

## Build

```sh
node bin/build.js --target=electron-deb
```

## Try out

```sh
sudo dpkg -i ./lvce-oss_0.0.1_amd64.deb
```

## Troubleshooting

When installing the deb locally, it might show the error `.deb' couldn't be accessed by user '_apt'. - pkgAcquire::Run (13: Permission denied)`. As a workaround, run `sudo chown _apt /var/lib/update-notifier/package-data-downloads/partial/` (see https://askubuntu.com/questions/954862/couldnt-be-accessed-by-user-apt-pkgacquirerun-13-permission-denied)

Tip: Use [lintian](http://manpages.ubuntu.com/manpages/trusty/man1/lintian.1.html) to check the deb for errors/warnings
