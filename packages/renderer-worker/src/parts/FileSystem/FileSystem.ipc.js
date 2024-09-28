import * as FileSystem from './FileSystem.js'

export const name = 'FileSystem'

export const Commands = {
  chmod: FileSystem.chmod,
  getBlob: FileSystem.getBlob,
  getPathSeparator: FileSystem.getPathSeparator,
  mkdir: FileSystem.mkdir,
  readDirWithFileTypes: FileSystem.readDirWithFileTypes,
  readFile: FileSystem.readFile,
  remove: FileSystem.remove,
  writeFile: FileSystem.writeFile,
}
