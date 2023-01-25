import * as Logger from '../Logger/Logger.js'

export const handleError = (error) => {
  if (`${error}` === 'Script error.') {
    // ignore errors from chrome extensions
    return
  }
  Logger.info(`[renderer-process] Unhandled Error: ${error}`)
  alert(error)
}

export const handleUnhandledRejection = (event) => {
  Logger.info(`[renderer-process] Unhandled Rejection: ${event.reason}`)
  alert(event.reason)
}
