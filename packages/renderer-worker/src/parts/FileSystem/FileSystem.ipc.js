import * as FileSystem from './FileSystem.js'

// TODO who calls this?
// TODO how to return value?

// prettier-ignore
export const Commands = {
  'FileSystem.readFile': FileSystem.readFile,
  'FileSystem.remove': FileSystem.remove,
  'FileSystem.readDirWithFileTypes': FileSystem.readDirWithFileTypes,
  'FileSystem.writeFile': FileSystem.writeFile,
  'FileSystem.mkdir': FileSystem.mkdir,
}

// TODO maybe no ipc needed for this module
