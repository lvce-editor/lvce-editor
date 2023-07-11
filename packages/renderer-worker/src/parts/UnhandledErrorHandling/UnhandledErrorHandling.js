import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'

/**
 * @param {PromiseRejectionEvent} event
 */
export const handleUnhandledRejection = (event) => {
  event.preventDefault()
  ErrorHandling.handleError(event.reason, false, '[renderer-worker] Unhandled Rejection: ')
}

/**
 * @param {Error} error
 */
export const handleUnhandledError = (message, filename, lineno, colno, error) => {
  ErrorHandling.handleError(error, false, '[renderer-worker] Unhandled Error: ')
  return true
}
