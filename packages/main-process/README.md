# main-process

The `main-process` is a NodeJS process that runs Electron.

- `main-process` is created when the Electron application is launched
- `main-process` can create Windows using Apis from Electron.
- `main-process` spawns `shared-process`
- `main-process` and `shared-process` can communicate via ipc

## Profiling the main process

```sh
killall electron &&
npx electron --wait src/profile.js
```

This will create a `profile.cpuprofile` file, which can be loaded inside the chrome devtools performance panel.
