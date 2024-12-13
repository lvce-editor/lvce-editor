import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const isStreamPrematureCloseError = (error) => {
  return error && error.code === ErrorCodes.ERR_STREAM_PREMATURE_CLOSE
}
