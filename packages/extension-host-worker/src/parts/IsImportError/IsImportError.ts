import * as IsImportErrorChrome from '../IsImportErrorChrome/IsImportErrorChrome.ts'
import * as IsImportErrorFirefox from '../IsImportErrorFirefox/IsImportErrorFirefox.ts'
import * as IsSyntaxError from '../IsSyntaxError/IsSyntaxError.ts'

export const isImportError = (error) => {
  return IsImportErrorChrome.isImportErrorChrome(error) || IsImportErrorFirefox.isImportErrorFirefox(error) || IsSyntaxError.isSyntaxError(error)
}
