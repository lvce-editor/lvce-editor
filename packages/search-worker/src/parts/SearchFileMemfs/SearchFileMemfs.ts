import * as FileSystemMemory from '../FileSystem/FileSystemMemory.js'

export const searchFile = async (path, value) => {
  const files = FileSystemMemory.state.files
  const keys = Object.keys(files)
  return keys
}
