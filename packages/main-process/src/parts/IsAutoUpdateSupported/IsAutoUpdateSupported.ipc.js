const IsAutoUpdateSupported = require('./IsAutoUpdateSupported.js')

exports.name = 'IsAutoUpdateSupported'

exports.Commands = {
  isAutoUpdateSupported: IsAutoUpdateSupported.isAutoUpdateSupported,
}
