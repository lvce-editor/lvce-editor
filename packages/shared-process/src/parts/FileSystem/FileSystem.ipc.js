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
export const __initialize__ = () => {
  Command.register('FileSystem.readFile', FileSystem.readFile)
  Command.register('FileSystem.writeFile', FileSystem.writeFile)
  Command.register('FileSystem.readDirWithFileTypes', FileSystem.readDirWithFileTypes)
  Command.register('FileSystem.remove', FileSystem.remove)
  Command.register('FileSystem.mkdir', FileSystem.mkdir)
  // Command.register(106, fileSystemWatch) // TODO
  Command.register('FileSystem.createFile', FileSystem.createFile)
  Command.register('FileSystem.createFolder', FileSystem.createFolder)
  Command.register('FileSystem.rename', FileSystem.rename)
  Command.register('FileSystem.ensureFile', FileSystem.ensureFile)
  Command.register('FileSystem.copy', FileSystem.copy)
  Command.register('FileSystem.getPathSeparator', FileSystem.getPathSeparator)
}
