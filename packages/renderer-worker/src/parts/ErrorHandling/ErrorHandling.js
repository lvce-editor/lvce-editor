import * as Command from '../Command/Command.js'
import * as PrettyError from '../PrettyError/PrettyError.js'

export const state = {
  /**
   * @type {string[]}
   */
  seenWarnings: [],
}

export const logError = async (error, prefix = '') => {
  const prettyError = await PrettyError.prepare(error)
  PrettyError.print(prettyError, prefix)
  return prettyError
}

export const handleError = async (error, notify = true, prefix = '') => {
  try {
    const prettyError = await logError(error, prefix)
    if (notify) {
      await Command.execute(/* Notification.create */ 'Notification.create', /* type */ 'error', /* text */ PrettyError.getMessage(prettyError))
    }
  } catch (otherError) {
    console.warn(`ErrorHandling error`)
    console.warn(otherError)
    console.error(error)
  }
}

export const showErrorDialog = async (error) => {
  try {
    const prettyError = await PrettyError.prepare(error)
    await Command.execute(/* Dialog.showMessage */ 'Dialog.showMessage', /* message */ prettyError)
  } catch {
    // ignore
  }
}

export const warn = (...args) => {
  const stringified = JSON.stringify(args)
  if (state.seenWarnings.includes(stringified)) {
    return
  }
  state.seenWarnings.push(stringified)
  console.warn(...args)
}

/**
 * @param {PromiseRejectionEvent} event
 */
export const handleUnhandledRejection = (event) => {
  handleError(event.reason, false, '[renderer-worker] Unhandled Rejection: ')
  return true
}

/**
 * @param {Error} error
 */
export const handleUnhandledError = (message, filename, lineno, colno, error) => {
  handleError(error, false, '[renderer-worker] Unhandled Error: ')
  return true
}
