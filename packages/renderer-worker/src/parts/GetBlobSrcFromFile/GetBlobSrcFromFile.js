import * as FileSystemHtml from '../FileSystem/FileSystemHtml.js'

export const getBlobSrcFromFile = async (uri) => {
  const handle = await FileSystemHtml.getFileHandle(uri)
  if (!handle) {
    throw new Error(`file not found`)
  }
  // TODO create object url from file
}
