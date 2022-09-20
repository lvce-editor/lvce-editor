import * as FileSystemWeb from '../FileSystem/FileSystemWeb.js'

export const searchFile = async (path, value) => {
  const files = FileSystemWeb.state.files
  const keys = Object.keys(files)
  return keys
}
