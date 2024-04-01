import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as IsChromeExtensionError from '../IsChromeExtensionError/IsChromeExtensionError.ts'

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
