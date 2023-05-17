import * as ExitCode from '../ExitCode/ExitCode.js'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'
import * as IsIgnoredError from '../IsIgnoredError/IsIgnoredError.js'
import * as Logger from '../Logger/Logger.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
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
  console.error(`${prettyError.message}\n${prettyError.codeFrame}\n${prettyError.stack}`)
}

export const handleError = (error) => {
  if (state.seenErrors.includes(error.message)) {
    return
  }
  state.seenErrors.push(error.message)
  const prettyError = preparePrettyError(error)
  // Socket.send({
  //   jsonrpc: JsonRpcVersion.Two,
  //   method: /* Dialog.showErrorDialogWithOptions */ 'Dialog.showMessage',
  //   params: [
  //     {
  //       message: prettyError.message,
  //       codeFrame: prettyError.codeFrame,
  //       stack: prettyError.stack,
  //     },
  //   ],
  // })
  printPrettyError(prettyError)
}

// TODO handle structure: one shared process multiple extension hosts

// TODO use named functions here

const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, GetNewLineIndex.getNewLineIndex(error.stack))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}

export const handleUncaughtExceptionMonitor = (error, origin) => {
  Logger.info(`[shared process] uncaught exception: ${firstErrorLine(error)}`)
  if (IsIgnoredError.isIgnoredError(error)) {
    return
  }
  const prettyError = PrettyError.prepare(error)
  Logger.error(prettyError.codeFrame + '\n' + prettyError.stack + '\n')
  Process.setExitCode(ExitCode.Error)
}
