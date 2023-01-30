const { protocol } = require('electron')

/**
 *
 * @param {Electron.CustomScheme[]} schemes
 */
exports.registerSchemesAsPrivileged = (schemes) => {
  protocol.registerSchemesAsPrivileged(schemes)
}
