import * as Blob from './Blob.js'

export const name = 'Blob'

export const Commands = {
  base64StringToBlob: Blob.base64StringToBlob,
  binaryStringToBlob: Blob.binaryStringToBlob,
  blobToBinaryString: Blob.blobToBinaryString,
}
