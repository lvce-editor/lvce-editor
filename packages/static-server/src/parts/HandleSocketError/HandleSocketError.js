import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const handleSocketError = (error) => {
  if (error && error.code === ErrorCodes.ECONNRESET) {
    return
  }
  if (error && error.code === ErrorCodes.EPIPE) {
    return
  }
  console.info(`[static-server] socket error ${error}`)
}
