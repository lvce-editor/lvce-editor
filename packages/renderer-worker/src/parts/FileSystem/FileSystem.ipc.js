import * as Command from '../Command/Command.js'
import * as FileSystem from './FileSystem.js'

// TODO who calls this?
// TODO how to return value?

// prettier-ignore
export const __initialize__ = () => {
  Command.register('FileSystem.readFile', FileSystem.readFile)
  Command.register('FileSystem.remove', FileSystem.remove)
  Command.register('FileSystem.readDirWithFileTypes', FileSystem.readDirWithFileTypes)
}

// TODO maybe no ipc needed for this module
