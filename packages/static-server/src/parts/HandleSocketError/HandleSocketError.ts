import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const handleSocketError = (error: NodeJS.ErrnoException): void => {
  if (error && error.code === ErrorCodes.ECONNRESET) {
    return
  }
  if (error && error.code === ErrorCodes.EPIPE) {
    return
  }
  console.info(`[static-server] socket error ${error}`)
}
