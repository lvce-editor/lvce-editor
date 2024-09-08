import * as GetFileHandle from '../GetFileHandle/GetFileHandle.js'

export const getBlobSrcFromFile = async (uri) => {
  const filePath = uri.slice('html://'.length)
  const handle = await GetFileHandle.getFileHandle(filePath)
  if (!handle) {
    throw new Error(`file not found`)
  }
  const file = await handle.getFile()
  const blobUrl = URL.createObjectURL(file)
  return blobUrl
}
