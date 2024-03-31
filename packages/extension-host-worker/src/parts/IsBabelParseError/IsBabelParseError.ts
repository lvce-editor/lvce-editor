import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as IsSyntaxError from '../IsSyntaxError/IsSyntaxError.ts'

export const isBabelError = (error) => {
  // @ts-ignore
  return IsSyntaxError.isSyntaxError(error) && error.code === ErrorCodes.BABEL_PARSER_SYNTAX_ERROR
}
