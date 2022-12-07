import * as Command from '../Command/Command.js'
import * as PrettyError from '../PrettyError/PrettyError.js'

export const state = {
  /**
   * @type {string[]}
   */
  seenWarnings: [],
}

export const logError = async (error) => {
  const prettyError = await PrettyError.prepare(error)
  const prettyErrorString = PrettyError.print(prettyError)
  console.error(prettyErrorString)
  return prettyError
}

export const handleError = async (error) => {
  try {
    const prettyError = await logError(error)
    await Command.execute(
      /* Notification.create */ 'Notification.create',
      /* type */ 'error',
      /* text */ PrettyError.getMessage(prettyError)
    )
  } catch (otherError) {
    console.warn(`ErrorHandling error`)
    console.warn(otherError)
    console.error(error)
  }
}

export const showErrorDialog = async (error) => {
  try {
    const prettyError = await PrettyError.prepare(error)
    await Command.execute(
      /* Dialog.showMessage */ 'Dialog.showMessage',
      /* message */ prettyError
    )
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
export const handleUnhandledRejection = async (event) => {
  try {
    event.preventDefault()
    await handleError(event.reason)
  } catch {
    console.error(event.reason)
  }
}

/**
 * @param {ErrorEvent} event
 */
export const handleUnhandledError = async (event) => {
  try {
    event.preventDefault()
    await handleError(event.error)
  } catch {
    console.error(event.error)
  }
}
