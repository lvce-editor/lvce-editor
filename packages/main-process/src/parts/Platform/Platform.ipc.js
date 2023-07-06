const Platform = require('./Platform.js')

exports.name = 'Platform'

exports.Commands = {
  getCommit: Platform.getCommit,
  getProductNameLong: Platform.getProductNameLong,
  getVersion: Platform.getVersion,
}
