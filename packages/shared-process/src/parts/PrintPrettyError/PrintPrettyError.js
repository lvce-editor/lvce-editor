import * as Logger from '../Logger/Logger.js'

export const printPrettyError = (prettyError, prefix = '') => {
  Logger.error(`${prefix}Error: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}`)
}
