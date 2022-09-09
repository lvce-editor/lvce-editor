const ElectronSafeStorage = require('./ElectronSafeStorage.js')

// prettier-ignore
exports.Commands = {
  'ElectronSafeStorage.isEncryptionAvailable': ElectronSafeStorage.isEncryptionAvailable,
  'ElectronSafeStorage.encryptString': ElectronSafeStorage.encryptString,
  'ElectronSafeStorage.decryptString': ElectronSafeStorage.decryptString,
}
