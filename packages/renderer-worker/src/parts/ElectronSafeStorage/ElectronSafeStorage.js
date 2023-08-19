import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const isEncryptionAvailable = () => {
  return SharedProcess.invoke('ElectronSafeStorage.isEncryptionAvailable')
}

export const encryptString = (plainText) => {
  return SharedProcess.invoke('ElectronSafeStorage.encryptString', plainText)
}

export const decryptString = (encrypted) => {
  return SharedProcess.invoke('ElectronSafeStorage.decryptString', encrypted)
}
