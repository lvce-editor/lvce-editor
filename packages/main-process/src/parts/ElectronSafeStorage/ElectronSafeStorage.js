const { safeStorage } = require('electron')
const EncodingType = require('../EncodingType/EncodingType.js')

exports.isEncryptionAvailable = () => {
  return safeStorage.isEncryptionAvailable()
}

exports.encryptString = (plainText) => {
  return safeStorage.encryptString(plainText).toString(EncodingType.Base64)
}

exports.decryptString = (encrypted) => {
  const buffer = Buffer.from(encrypted, EncodingType.Base64)
  return safeStorage.decryptString(buffer)
}
