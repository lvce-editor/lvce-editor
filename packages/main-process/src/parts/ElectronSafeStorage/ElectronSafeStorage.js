import { safeStorage } from 'electron'
import * as EncodingType from '../EncodingType/EncodingType.cjs'

export const isEncryptionAvailable = () => {
  return safeStorage.isEncryptionAvailable()
}

export const encryptString = (plainText) => {
  return safeStorage.encryptString(plainText).toString(EncodingType.Base64)
}

export const decryptString = (encrypted) => {
  const buffer = Buffer.from(encrypted, EncodingType.Base64)
  return safeStorage.decryptString(buffer)
}
