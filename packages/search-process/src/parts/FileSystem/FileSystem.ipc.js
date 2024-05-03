import * as FileSystem from './FileSystem.js'

// TODO ugly code here -> should be inside FileSystem.js
const fileSystemWatch = (socket, id, path) => {
  // const watcher = FileSystem.watch(path, {
  //   onAll(...args) {
  //     socket.send(JSON.stringify([/* callback */ id, /* event */ args]))
  //   }
  // }
  // )
  // socket.on('close', () => {
  //   watcher.close()
  // })
}

export const name = 'FileSystem'

// TODO separate ipc from code like in renderer worker
export const Commands = {
  chmod: FileSystem.chmod,
  copy: FileSystem.copy,
  createFile: FileSystem.createFile,
  createFolder: FileSystem.createFolder,
  ensureFile: FileSystem.ensureFile,
  getPathSeparator: FileSystem.getPathSeparator,
  getRealPath: FileSystem.getRealPath,
  mkdir: FileSystem.mkdir,
  readDirWithFileTypes: FileSystem.readDirWithFileTypes,
  readFile: FileSystem.readFile,
  remove: FileSystem.remove,
  rename: FileSystem.rename,
  stat: FileSystem.stat,
  writeFile: FileSystem.writeFile,
}
