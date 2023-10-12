import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as Logger from '../Logger/Logger.js'

export const handleSocketError = (error) => {
  if (error && error.code === ErrorCodes.ECONNRESET) {
    return
  }
  if (error && error.code === ErrorCodes.EPIPE) {
    return
  }
  Logger.info('[info shared process: handle error]', error)
}
