import * as FileSystem from './FileSystem.js'

// prettier-ignore
export const Commands = {
  'FileSystem.readFile': FileSystem.readFile,
  'FileSystem.remove': FileSystem.remove,
  'FileSystem.readDirWithFileTypes': FileSystem.readDirWithFileTypes,
  'FileSystem.writeFile': FileSystem.writeFile,
  'FileSystem.mkdir': FileSystem.mkdir,
  'FileSystem.chmod': FileSystem.chmod,
  'FileSystem.getPathSeparator': FileSystem.getPathSeparator,
}
