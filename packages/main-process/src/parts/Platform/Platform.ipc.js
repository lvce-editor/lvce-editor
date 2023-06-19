const Platform = require('./Platform.js')

exports.name = 'Platform'

exports.Commands = {
  getVersion: Platform.getVersion,
  getCommit: Platform.getCommit,
  getProductNameLong: Platform.getProductNameLong,
}
