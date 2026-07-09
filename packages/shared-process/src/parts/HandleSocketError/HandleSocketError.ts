import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as Logger from '../Logger/Logger.ts'

export const handleSocketError = (error: any): any => {
  if (error && error.code === ErrorCodes.ECONNRESET) {
    return
  }
  if (error && error.code === ErrorCodes.EPIPE) {
    return
  }
  Logger.info('[info shared process: handle error]', error)
}
