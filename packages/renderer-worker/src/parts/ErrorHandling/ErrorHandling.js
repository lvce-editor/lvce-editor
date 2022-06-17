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
  console.log({ error })
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

const printError = (error) => {
  console.error(error)
  if (error && error.cause) {
    console.error('caused by')
    printError(error.cause)
  }
}

// TODO state is not needed here but because jest doesn't support mocking for esm yet this is a workaround
export const state = {
  async handleError(error) {
    printError(error)
    const enhancedErrorMessage = enhanceErrorMessage(error)
    await Command.execute(
      /* Notification.create */ 900,
      /* type */ 'error',
      /* text */ enhancedErrorMessage
    )
  },
  async showErrorDialog(error) {
    const enhancedErrorMessage = enhanceErrorMessage(error)
    await Command.execute(
      /* Dialog.showErrorMessage */ 1494,
      /* message */ enhancedErrorMessage
    )
  },
  seenWarnings: [],
}

export const handleError = async (error) => {
  await state.handleError(error)
}

export const showErrorDialog = async (error) => {
  await state.showErrorDialog(error)
}

export const warn = (...args) => {
  const stringified = JSON.stringify(args)
  if (state.seenWarnings.includes(stringified)) {
    return
  }
  state.seenWarnings.push(stringified)
  console.warn(...args)
}
