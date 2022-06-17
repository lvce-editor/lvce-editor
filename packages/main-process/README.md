# main-process

The `main-process` is a NodeJS process that runs Electron.

- `main-process` is created when the Electron application is launched
- `main-process` can create Windows using Apis from Electron.
- `main-process` spawns `shared-process`
- `main-process` and `shared-process` can communicate via ipc
