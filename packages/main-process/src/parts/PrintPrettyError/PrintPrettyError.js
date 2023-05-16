const Logger = require('../Logger/Logger.js')

exports.printPrettyError = (prettyError, prefix = '') => {
  Logger.error(`${prefix}${prettyError.type}: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}\n`)
}
