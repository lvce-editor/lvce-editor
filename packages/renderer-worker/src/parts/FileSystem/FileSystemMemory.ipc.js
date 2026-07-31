import * as FileSystemMemory from './FileSystemMemory.js'

export const name = 'FileSystemMemory'

export const Commands = {
  chmod: FileSystemMemory.chmod,
  copy: FileSystemMemory.copy,
  createFile: FileSystemMemory.createFile,
  exists: FileSystemMemory.exists,
  getBlob: FileSystemMemory.getBlob,
  getBlobUrl: FileSystemMemory.getBlobUrl,
  getFiles: FileSystemMemory.getFiles,
  mkdir: FileSystemMemory.mkdir,
  readDirWithFileTypes: FileSystemMemory.readDirWithFileTypes,
  readFile: FileSystemMemory.readFile,
  remove: FileSystemMemory.remove,
  rename: FileSystemMemory.rename,
  stat: FileSystemMemory.stat,
  writeFile: FileSystemMemory.writeFile,
}
