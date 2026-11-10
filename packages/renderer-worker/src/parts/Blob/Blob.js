import * as BlobWorker from '../BlobWorker/BlobWorker.js'

export const base64StringToBlob = (base64String) => {
  return BlobWorker.invoke('Blob.base64StringToBlob', base64String)
}

export const binaryStringToBlob = async (string, type) => {
  return BlobWorker.invoke('Blob.binaryStringToBlob', string, type)
}

export const blobToBinaryString = async (blob) => {
  return BlobWorker.invoke('Blob.blobToBinaryString', blob)
}
