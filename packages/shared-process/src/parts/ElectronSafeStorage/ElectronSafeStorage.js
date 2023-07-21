import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const isEncryptionAvailable = () => {
  return ParentIpc.invoke('ElectronSafeStorage.isEncryptionAvailable')
}

export const encryptString = (plainText) => {
  return ParentIpc.invoke('ElectronSafeStorage.encryptString', plainText)
}

export const decryptString = (encrypted) => {
  return ParentIpc.invoke('ElectronSafeStorage.decryptString', encrypted)
}
