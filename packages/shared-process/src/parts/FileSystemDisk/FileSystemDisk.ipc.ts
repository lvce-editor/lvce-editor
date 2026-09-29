import * as FileSystemDisk from './FileSystemDisk.ts'

export const name = 'FileSystemDisk'

export const Commands = {
  chmod: FileSystemDisk.chmod,
  copy: FileSystemDisk.copy,
  getFolderSize: FileSystemDisk.getFolderSize,
  mkdir: FileSystemDisk.mkdir,
  readDirWithFileTypes: FileSystemDisk.readDirWithFileTypes,
  readFile: FileSystemDisk.readFile,
  readJson: FileSystemDisk.readJson,
  remove: FileSystemDisk.remove,
  rename: FileSystemDisk.rename,
  stat: FileSystemDisk.stat,
  writeFile: FileSystemDisk.writeFile,
}
