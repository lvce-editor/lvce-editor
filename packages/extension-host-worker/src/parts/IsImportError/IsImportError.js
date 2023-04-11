import * as IsImportErrorChrome from '../IsImportErrorChrome/IsImportErrorChrome.js'
import * as IsImportErrorFirefox from '../IsImportErrorFirefox/IsImportErrorFirefox.js'
import * as IsSyntaxError from '../IsSyntaxError/IsSyntaxError.js'

export const isImportError = (error) => {
  return IsImportErrorChrome.isImportErrorChrome(error) || IsImportErrorFirefox.isImportErrorFirefox(error)
}
