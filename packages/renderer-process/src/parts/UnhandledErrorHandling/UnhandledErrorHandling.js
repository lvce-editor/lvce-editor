import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as IsChromeExtensionError from '../IsChromeExtensionError/IsChromeExtensionError.js'
import * as IsFirefoxWorkerError from '../IsFirefoxWorkerError/IsFirefoxWorkerError.js'

export const handleUnhandledRejection = (event) => {
  event.preventDefault()
  ErrorHandling.handleError(event.reason, true, '[renderer process] Unhandled Rejection: ')
}

export const handleUnhandledError = (message, filename, lineno, colno, error) => {
  if (IsChromeExtensionError.isChromeExtensionError(message)) {
    // ignore errors from chrome extensions
    return
  }
  if (IsFirefoxWorkerError.isFirefoxWorkerError(message)) {
    // ignore firefox worker errors
    return
  }
  ErrorHandling.handleError(error, true, '[renderer-process] Unhandled Error: ')
}
