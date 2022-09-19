import * as BlobUtil from '../../../../../static/js/blob-util.js'

export const base64StringToBlob = (base64String) => {
  return BlobUtil.base64StringToBlob(base64String)
}

export const binaryStringToBlob = (string, type) => {
  return BlobUtil.binaryStringToBlob(string, type)
}

export const blobToBinaryString = (blob) => {
  return BlobUtil.blobToBinaryString(blob)
}
