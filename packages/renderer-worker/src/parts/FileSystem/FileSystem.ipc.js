import * as FileSystem from './FileSystem.js'

export const name = 'FileSystem'

export const Commands = {
  chmod: FileSystem.chmod,
  copy: FileSystem.copy,
  createFile: FileSystem.createFile,
  exists: FileSystem.exists,
  getBlob: FileSystem.getBlob,
  getFileSize: FileSystem.getFileSize,
  getFolderSize: FileSystem.getFolderSize,
  getRealPath: FileSystem.getRealPath,
  isReadonly: FileSystem.isReadonly,
  mkdir: FileSystem.mkdir,
  readDirWithFileTypes: FileSystem.readDirWithFileTypes,
  readFile: FileSystem.readFile,
  readJson: FileSystem.readJson,
  remove: FileSystem.remove,
  rename: FileSystem.rename,
  stat: FileSystem.stat,
  statWithMetadata: FileSystem.statWithMetadata,
  writeFile: FileSystem.writeFile,
  writeBlob: FileSystem.writeBlob,
}
