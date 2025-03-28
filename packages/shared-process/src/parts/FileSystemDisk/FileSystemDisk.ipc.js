import * as FileSystemDisk from './FileSystemDisk.js'

export const name = 'FileSystemDisk'

export const Commands = {
  chmod: FileSystemDisk.chmod,
  copy: FileSystemDisk.copy,
  getPathSeparator: FileSystemDisk.getPathSeparator,
  mkdir: FileSystemDisk.mkdir,
  readDirWithFileTypes: FileSystemDisk.readDirWithFileTypes,
  readFile: FileSystemDisk.readFile,
  readJson: FileSystemDisk.readJson,
  remove: FileSystemDisk.remove,
  rename: FileSystemDisk.rename,
  stat: FileSystemDisk.stat,
  writeFile: FileSystemDisk.writeFile,
  getFolderSize: FileSystemDisk.getFolderSize,
}
