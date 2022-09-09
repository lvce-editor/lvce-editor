const { safeStorage } = require('electron')

exports.isEncryptionAvailable = () => {
  return safeStorage.isEncryptionAvailable()
}

exports.encryptString = (plainText) => {
  return safeStorage.encryptString(plainText).toString('base64')
}

exports.decryptString = (encrypted) => {
  const buffer = Buffer.from(encrypted, 'base64')
  return safeStorage.decryptString(buffer)
}
