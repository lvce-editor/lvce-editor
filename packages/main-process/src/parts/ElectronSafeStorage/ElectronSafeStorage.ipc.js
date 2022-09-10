const ElectronSafeStorage = require('./ElectronSafeStorage.js')

// prettier-ignore
exports.Commands = {
  'ElectronSafeStorage.decryptString': ElectronSafeStorage.decryptString,
  'ElectronSafeStorage.encryptString': ElectronSafeStorage.encryptString,
  'ElectronSafeStorage.isEncryptionAvailable': ElectronSafeStorage.isEncryptionAvailable,
}
