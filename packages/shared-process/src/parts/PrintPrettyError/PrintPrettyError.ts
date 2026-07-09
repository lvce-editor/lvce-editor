import * as Logger from '../Logger/Logger.ts'

export const printPrettyError = (prettyError, prefix = '') => {
  Logger.error(`${prefix}${prettyError.type}: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}\n`)
}
