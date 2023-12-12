import { safeStorage } from 'electron'
import * as EncodingType from '../EncodingType/EncodingType.js'

export const isEncryptionAvailable = () => {
  return safeStorage.isEncryptionAvailable()
}

export const encrypt = (plainText) => {
  return safeStorage.encryptString(plainText).toString(EncodingType.Base64)
}

export const decrypt = (encrypted) => {
  const buffer = Buffer.from(encrypted, EncodingType.Base64)
  return safeStorage.decryptString(buffer)
}
