import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as IsSyntaxError from '../IsSyntaxError/IsSyntaxError.js'

export const isBabelError = (error) => {
  // @ts-ignore
  return IsSyntaxError(error) && error.code === ErrorCodes.BABEL_PARSER_SYNTAX_ERROR
}
