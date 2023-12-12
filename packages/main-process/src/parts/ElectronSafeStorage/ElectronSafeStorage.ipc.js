import * as ElectronSafeStorage from './ElectronSafeStorage.js'

export const name = 'ElectronSafeStorage'

export const Commands = {
  decrypt: ElectronSafeStorage.decrypt,
  encrypt: ElectronSafeStorage.encrypt,
  isEncryptionAvailable: ElectronSafeStorage.isEncryptionAvailable,
}
