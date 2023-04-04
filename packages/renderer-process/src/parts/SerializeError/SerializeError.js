import * as EnsureError from '../EnsureError/EnsureError.js'

export const serializeError = (error) => {
  error = EnsureError.ensureError(error)
  return {
    stack: error.stack,
    message: error.message,
    name: error.name,
    type: error.constructor.name,
  }
}
