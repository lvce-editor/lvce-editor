// import * as FileSystemWeb from '../FileSystem/FileSystemWeb.js'

const removeLeadingSlash = (file) => {
  return file.slice(1)
}

export const searchFile = async (path, value) => {
  // TODO get files from renderer worker FileSystemWeb.state.files
  const files = {}
  const keys = Object.keys(files).map(removeLeadingSlash)
  return keys
}
