import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const isEncryptionAvailable = () => {
  return ElectronProcess.invoke('ElectronSafeStorage.isEncryptionAvailable')
}

export const encryptString = (plainText) => {
  return ElectronProcess.invoke('ElectronSafeStorage.encryptString', plainText)
}

export const decryptString = (encrypted) => {
  return ElectronProcess.invoke('ElectronSafeStorage.decryptString', encrypted)
}
