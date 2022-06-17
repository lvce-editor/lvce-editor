import * as Command from '../Command/Command.js'
import * as FileSystem from './FileSystem.js'

// TODO who calls this?
// TODO how to return value?

export const __initialize__ = () => {
  Command.register(501, FileSystem.readFile)
  Command.register(502, FileSystem.remove)
  Command.register(503, FileSystem.readDirWithFileTypes)
}

// TODO maybe no ipc needed for this module
