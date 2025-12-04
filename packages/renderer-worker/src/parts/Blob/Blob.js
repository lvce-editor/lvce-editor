import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'

export const base64StringToBlob = (base64String) => {
  return FileSystemWorker.invoke('Blob.base64StringToBlob', base64String)
}

export const binaryStringToBlob = async (string, type) => {
  return FileSystemWorker.invoke('Blob.binaryStringToBlob', string, type)
}

export const blobToBinaryString = async (blob) => {
  return FileSystemWorker.invoke('Blob.blobToBinaryString', blob)
}
