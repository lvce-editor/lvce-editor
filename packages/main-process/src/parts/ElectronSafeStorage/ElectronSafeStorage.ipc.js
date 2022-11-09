const ElectronSafeStorage = require('./ElectronSafeStorage.js')

exports.name = 'ElectronSafeStorage'

// prettier-ignore
exports.Commands = {
  decryptString: ElectronSafeStorage.decryptString,
  encryptString: ElectronSafeStorage.encryptString,
  isEncryptionAvailable: ElectronSafeStorage.isEncryptionAvailable,
}
