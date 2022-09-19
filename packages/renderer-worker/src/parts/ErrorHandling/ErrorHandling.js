import * as Command from '../Command/Command.js'

// TODO use https://github.com/stack-tools-js/stack-tools to print error

const enhanceErrorMessage = (error) => {
  if (!error) {
    return {
      message: `Error: ${error}`,
      stack: undefined,
      codeFrame: undefined,
    }
  }
  let message = `${error}`
  while (error.cause) {
    error = error.cause
    message += `: ${error}`
  }
  return {
    message,
    stack: error.originalStack,
    codeFrame: error.originalCodeFrame,
    category: error.category,
    stderr: error.stderr,
  }
}

// const getErrorMessage = (error) => {
//   let message = ``
//   if (error && error.message) {
//     message += error.message
//   }
//   if (error && error.stack) {
//     message += `\n${error.stack}`
//   }
//   if (error && error.cause) {
//     message += getErrorMessage(error.cause)
//   }
//   return message
// }

// const printError = (error) => {
//   const message = getErrorMessage(error)
//   console.error(message)
// }

export const printError = (error) => {
  if (error && error.message && error.codeFrame) {
    console.error(`${error.message}\n\n${error.codeFrame}\n\n${error.stack}`)
  } else {
    console.error(error)
    if (error && error.cause) {
      console.error('caused by')
      printError(error.cause)
    }
  }
}

export const state = {
  /**
   * @type {string[]}
   */
  seenWarnings: [],
}

export const handleError = async (error) => {
  try {
    printError(error)
    const enhancedErrorMessage = enhanceErrorMessage(error)
    await Command.execute(
      /* Notification.create */ 'Notification.create',
      /* type */ 'error',
      /* text */ enhancedErrorMessage.message
    )
  } catch {
    // ignore
  }
}

export const showErrorDialog = async (error) => {
  try {
    const enhancedErrorMessage = enhanceErrorMessage(error)
    await Command.execute(
      /* Dialog.showMessage */ 'Dialog.showMessage',
      /* message */ enhancedErrorMessage
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
