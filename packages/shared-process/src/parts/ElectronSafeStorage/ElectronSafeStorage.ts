import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const isEncryptionAvailable = (): any => {
  return ParentIpc.invoke('ElectronSafeStorage.isEncryptionAvailable')
}

export const encryptString = async (plainText: any): Promise<any> => {
  const buffer = await ParentIpc.invoke('ElectronSafeStorage.encrypt', plainText)
  return buffer.toString(EncodingType.Base64)
}

export const decryptString = (encrypted: any): any => {
  const buffer = Buffer.from(encrypted, EncodingType.Base64)
  return ParentIpc.invoke('ElectronSafeStorage.decrypt', buffer)
}
