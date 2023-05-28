import * as IsChromeExtensionError from '../IsChromeExtensionError/IsChromeExtensionError.js'
import * as IsFirefoxWorkerError from '../IsFirefoxWorkerError/IsFirefoxWorkerError.js'
import * as Logger from '../Logger/Logger.js'

export const handleUnhandledRejection = (event) => {
  Logger.info(`[renderer-process] Unhandled Rejection: ${event.reason}`)
  alert(event.reason)
}

export const handleUnhandledError = (error) => {
  if (IsChromeExtensionError.isChromeExtensionError(error)) {
    // ignore errors from chrome extensions
    return
  }
  if (IsFirefoxWorkerError.isFirefoxWorkerError(error)) {
    // ignore firefox worker errors
    return
  }
  Logger.error(`[renderer-process] Unhandled Error: ${error}`)
  alert(error)
}
