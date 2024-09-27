import * as FileSystemHtml from '../FileSystem/FileSystemHtml.js'

export const getBlobSrcFromFile = async (uri) => {
  const filePath = uri.slice('html://'.length)
  return FileSystemHtml.getBlobSrc(filePath)
}
