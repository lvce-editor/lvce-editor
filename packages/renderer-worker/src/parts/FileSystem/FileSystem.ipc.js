import * as FileSystem from './FileSystem.js'

// prettier-ignore
export const Commands = {
  'FileSystem.chmod': FileSystem.chmod,
  'FileSystem.getPathSeparator': FileSystem.getPathSeparator,
  'FileSystem.mkdir': FileSystem.mkdir,
  'FileSystem.readDirWithFileTypes': FileSystem.readDirWithFileTypes,
  'FileSystem.readFile': FileSystem.readFile,
  'FileSystem.remove': FileSystem.remove,
  'FileSystem.writeFile': FileSystem.writeFile,
}
