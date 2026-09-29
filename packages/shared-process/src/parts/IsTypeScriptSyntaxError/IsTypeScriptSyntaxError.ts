import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isTypeScriptSyntaxError = (error: any): boolean => {
  return error?.code === ErrorCodes.ERR_INVALID_TYPESCRIPT_SYNTAX
}
