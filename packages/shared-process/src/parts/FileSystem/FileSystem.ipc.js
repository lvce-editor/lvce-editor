import * as Command from '../Command/Command.js'
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
  'FileSystem.readFile': FileSystem.readFile,
  'FileSystem.writeFile': FileSystem.writeFile,
  'FileSystem.readDirWithFileTypes': FileSystem.readDirWithFileTypes,
  'FileSystem.remove': FileSystem.remove,
  'FileSystem.mkdir': FileSystem.mkdir,
  'FileSystem.createFile': FileSystem.createFile,
  'FileSystem.createFolder': FileSystem.createFolder,
  'FileSystem.rename': FileSystem.rename,
  'FileSystem.ensureFile': FileSystem.ensureFile,
  'FileSystem.copy': FileSystem.copy,
  'FileSystem.getPathSeparator': FileSystem.getPathSeparator,
}
