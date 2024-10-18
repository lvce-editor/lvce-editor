import * as FileSystemMemory from '../FileSystem/FileSystemMemory.js'

export const searchFile = async (path, value) => {
  const files = await FileSystemMemory.getFiles()
  const keys = Object.keys(files)
  return keys
}
