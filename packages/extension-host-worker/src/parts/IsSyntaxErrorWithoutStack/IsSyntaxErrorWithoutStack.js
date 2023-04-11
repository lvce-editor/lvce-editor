import * as IsSyntaxError from '../IsSyntaxError/IsSyntaxError.js'
export const isSyntaxErrorWithoutStack=error=>{

  return IsSyntaxError.isSyntaxError(error) &&
}