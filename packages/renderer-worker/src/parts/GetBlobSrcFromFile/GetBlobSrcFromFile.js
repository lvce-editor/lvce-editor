import * as GetFileHandle from '../GetFileHandle/GetFileHandle.js'

export const getBlobSrcFromFile = async (uri) => {
  const handle = await GetFileHandle.getFileHandle(uri)
  if (!handle) {
    throw new Error(`file not found`)
  }
  console.log({ handle })
  // TODO create object url from file
  return undefined
}
