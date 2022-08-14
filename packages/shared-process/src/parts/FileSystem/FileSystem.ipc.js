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

// TODO separate ipc from code like in renderer worker
export const Commands = {
  'FileSystem.copy': FileSystem.copy,
  'FileSystem.createFile': FileSystem.createFile,
  'FileSystem.createFolder': FileSystem.createFolder,
  'FileSystem.ensureFile': FileSystem.ensureFile,
  'FileSystem.getPathSeparator': FileSystem.getPathSeparator,
  'FileSystem.getRealPath': FileSystem.getRealPath,
  'FileSystem.mkdir': FileSystem.mkdir,
  'FileSystem.readDirWithFileTypes': FileSystem.readDirWithFileTypes,
  'FileSystem.readFile': FileSystem.readFile,
  'FileSystem.remove': FileSystem.remove,
  'FileSystem.rename': FileSystem.rename,
  'FileSystem.stat': FileSystem.stat,
  'FileSystem.writeFile': FileSystem.writeFile,
}
