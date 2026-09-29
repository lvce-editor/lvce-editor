import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isStreamPrematureCloseError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false
  }
  return error.code === ErrorCodes.ERR_STREAM_PREMATURE_CLOSE
}
