import * as EncodingType from '../EncodingType/EncodingType.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'

export const isEncryptionAvailable = () => {
  return ParentIpc.invoke('ElectronSafeStorage.isEncryptionAvailable')
}

export const encryptString = async (plainText) => {
  const buffer = await ParentIpc.invoke('ElectronSafeStorage.encrypt', plainText)
  return buffer.toString(EncodingType.Base64)
}

export const decryptString = (encrypted) => {
  const buffer = Buffer.from(encrypted, EncodingType.Base64)
  return ParentIpc.invoke('ElectronSafeStorage.decrypt', buffer)
}
