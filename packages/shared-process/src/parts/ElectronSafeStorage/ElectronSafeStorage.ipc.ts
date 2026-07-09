import * as ElectronSafeStorage from './ElectronSafeStorage.ts'

export const name = 'ElectronSafeStorage'

export const Commands = {
  decryptString: ElectronSafeStorage.decryptString,
  encryptString: ElectronSafeStorage.encryptString,
  isEncryptionAvailable: ElectronSafeStorage.isEncryptionAvailable,
}
