const { protocol } = require('electron')

exports.registerSchemesAsPrivileged = (schemes) => {
  protocol.registerSchemesAsPrivileged(schemes)
}
