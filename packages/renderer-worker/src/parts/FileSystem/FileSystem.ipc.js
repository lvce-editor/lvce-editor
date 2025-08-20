import * as FileSystem from './FileSystem.js'

export const name = 'FileSystem'

export const Commands = {
  chmod: FileSystem.chmod,
  copy: FileSystem.copy,
  exists: FileSystem.exists,
  getBlob: FileSystem.getBlob,
  getFolderSize: FileSystem.getFolderSize,
  getPathSeparator: FileSystem.getPathSeparator,
  getRealPath: FileSystem.getRealPath,
  mkdir: FileSystem.mkdir,
  readDirWithFileTypes: FileSystem.readDirWithFileTypes,
  readFile: FileSystem.readFile,
  readJson: FileSystem.readJson,
  remove: FileSystem.remove,
  rename: FileSystem.rename,
  stat: FileSystem.stat,
  writeFile: FileSystem.writeFile,
}
