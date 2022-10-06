import * as BlobUtil from '../../../../../static/js/blob-util.js'
import { VError } from '../VError/VError.js'

const normalizeError = (error) => {
  if (
    error &&
    error instanceof ProgressEvent &&
    error.target &&
    // @ts-ignore
    error.target.error
  ) {
    // @ts-ignore
    return error.target.error
  }
  return error
}

export const base64StringToBlob = (base64String) => {
  try {
    return BlobUtil.base64StringToBlob(base64String)
  } catch (error) {
    const normalizedError = normalizeError(error)
    throw new VError(normalizedError, `Failed to convert base64 string to blob`)
  }
}

export const binaryStringToBlob = async (string, type) => {
  try {
    return await BlobUtil.binaryStringToBlob(string, type)
  } catch (error) {
    const normalizedError = normalizeError(error)
    throw new VError(normalizedError, `Failed to convert binary string to blob`)
  }
}

export const blobToBinaryString = async (blob) => {
  try {
    return await BlobUtil.blobToBinaryString(blob)
  } catch (error) {
    const normalizedError = normalizeError(error)
    throw new VError(normalizedError, `Failed to convert blob to binary string`)
  }
}
