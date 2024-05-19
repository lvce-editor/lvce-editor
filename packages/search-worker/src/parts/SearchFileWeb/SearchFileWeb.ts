import * as FileSystemWeb from '../FileSystem/FileSystemWeb.js'

const removeLeadingSlash = (file) => {
  return file.slice(1)
}

export const searchFile = async (path, value) => {
  const files = FileSystemWeb.state.files
  const keys = Object.keys(files).map(removeLeadingSlash)
  return keys
}
