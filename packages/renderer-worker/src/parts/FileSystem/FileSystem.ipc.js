import * as FileSystem from './FileSystem.js'

export const name = 'FileSystem'

export const Commands = {
  chmod: FileSystem.chmod,
  copy: FileSystem.copy,
  getBlob: FileSystem.getBlob,
  getFolderSize: FileSystem.getFolderSize,
  getPathSeparator: FileSystem.getPathSeparator,
  mkdir: FileSystem.mkdir,
  readDirWithFileTypes: FileSystem.readDirWithFileTypes,
  readFile: FileSystem.readFile,
  readJson: FileSystem.readJson,
  remove: FileSystem.remove,
  rename: FileSystem.rename,
  writeFile: FileSystem.writeFile,
  stat: FileSystem.stat,
  getRealPath: FileSystem.getRealPath,
}
