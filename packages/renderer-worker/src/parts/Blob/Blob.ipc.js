import * as Blob from './Blob.js'
import * as BlobSrc from '../BlobSrc/BlobSrc.js'

export const name = 'Blob'

export const Commands = {
  base64StringToBlob: Blob.base64StringToBlob,
  binaryStringToBlob: Blob.binaryStringToBlob,
  blobToBinaryString: Blob.blobToBinaryString,
  getSrc: BlobSrc.getSrc,
}
