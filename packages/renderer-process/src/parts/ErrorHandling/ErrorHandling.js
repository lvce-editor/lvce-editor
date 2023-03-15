import * as IsChromeExtensionError from '../IsChromeExtensionError/IsChromeExtensionError.js'
import * as IsFirefoxWorkerError from '../IsFirefoxWorkerError/IsFirefoxWorkerError.js'
import * as Logger from '../Logger/Logger.js'

export const handleError = (error) => {
  if (IsChromeExtensionError.isChromeExtensionError(error)) {
    // ignore errors from chrome extensions
    return
  }
  if (IsFirefoxWorkerError.isFirefoxWorkerError(error)) {
    // ignore firefox worker errors
    return
  }
  Logger.info(`[renderer-process] Unhandled Error: ${error}`)
  alert(error)
}

export const handleUnhandledRejection = (event) => {
  Logger.info(`[renderer-process] Unhandled Rejection: ${event.reason}`)
  alert(event.reason)
}
