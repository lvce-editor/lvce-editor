import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as IsChromeExtensionError from '../IsChromeExtensionError/IsChromeExtensionError.js'

export const handleUnhandledRejection = (event) => {
  event.preventDefault()
  ErrorHandling.handleError(event.reason, true, '[renderer process] Unhandled Rejection: ')
}

export const handleUnhandledError = (message, filename, lineno, colno, error) => {
  if (IsChromeExtensionError.isChromeExtensionError(message)) {
    // ignore errors from chrome extensions
    return
  }
  ErrorHandling.handleError(error, Boolean(error), '[renderer-process] Unhandled Error: ')
}
