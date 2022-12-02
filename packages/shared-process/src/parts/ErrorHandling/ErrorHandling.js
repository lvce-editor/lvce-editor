import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as Socket from '../Socket/Socket.js'
import * as Process from '../Process/Process.js'

export const state = {
  seenErrors: [],
}

const preparePrettyError = (error) => {
  const cause = error.cause()
  return {
    message: error.message,
    codeFrame: cause.codeFrame,
    stack: cause.stack,
  }
}

const printPrettyError = (prettyError) => {
  console.error(
    `${prettyError.message}\n${prettyError.codeFrame}\n${prettyError.stack}`
  )
}

export const handleError = (error) => {
  if (state.seenErrors.includes(error.message)) {
    return
  }
  state.seenErrors.push(error.message)
  const prettyError = preparePrettyError(error)
  Socket.send({
    jsonrpc: '2.0',
    method: /* Dialog.showErrorDialogWithOptions */ 'Dialog.showMessage',
    params: [
      {
        message: prettyError.message,
        codeFrame: prettyError.codeFrame,
        stack: prettyError.stack,
      },
    ],
  })
  printPrettyError(prettyError)
}

// TODO handle structure: one shared process multiple extension hosts

// TODO use named functions here

const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, error.stack.indexOf('\n'))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}

export const handleUncaughtExceptionMonitor = (error, origin) => {
  console.info(`[shared process] uncaught exception: ${firstErrorLine(error)}`)
  if (error && error.code === ErrorCodes.EPIPE && !process.connected) {
    // parent process is disposed, ignore
    return
  }
  if (
    error &&
    error.code === ErrorCodes.ERR_IPC_CHANNEL_CLOSED &&
    !Process.isConnected()
  ) {
    // parent process is disposed, ignore
    return
  }
  // console.log(error)
  const prettyError = PrettyError.prepare(error)
  // console.error(prettyError.message)
  console.error(prettyError.codeFrame)
  console.error(prettyError.stack)
  Process.exit(1)
}
