import * as Command from '../Command/Command.js'
import * as PrettyError from '../PrettyError/PrettyError.js'

export const state = {
  /**
   * @type {string[]}
   */
  seenWarnings: [],
}

export const handleError = async (error) => {
  try {
    const prettyError = await PrettyError.prepare(error)
    console.error(PrettyError.print(prettyError))
    await Command.execute(
      /* Notification.create */ 'Notification.create',
      /* type */ 'error',
      /* text */ prettyError.message
    )
  } catch {
    // ignore
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
