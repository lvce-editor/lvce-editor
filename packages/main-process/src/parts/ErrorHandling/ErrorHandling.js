const { dialog, BrowserWindow } = require('electron')
const Logger = require('../Logger/Logger.js')
const Process = require('../Process/Process.js')
const PrettyError = require('../PrettyError/PrettyError.js')
const ExitCode = require('../ExitCode/ExitCode.js')
const GetNewLineIndex = require('../GetNewLineIndex/GetNewLineIndex.js')

const getDisplayMessage = (error) => {
  if (!error || !error.stack) {
    return `<unknown error>`
  }

  return `${error.stack}`
}

exports.handleError = (error) => {
  const prettyError = PrettyError.prepare(error)
  Logger.error(`[main-process] ${prettyError.type}: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}\n`)
}

const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, GetNewLineIndex.getNewLineIndex(error.stack))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}

exports.handleUncaughtExceptionMonitor = (error, origin) => {
  Logger.info(`[main process] uncaught exception: ${firstErrorLine(error)}`)
  const prettyError = PrettyError.prepare(error)
  Logger.error(prettyError.codeFrame)
  Logger.error(prettyError.stack)
  if (BrowserWindow.getAllWindows().length === 0) {
    Process.exit(ExitCode.Error)
  }
}

exports.handleUnhandledRejection = (reason, promise) => {
  const prettyError = PrettyError.prepare(reason)
  Logger.error(
    `[main process] unhandled rejection: ${prettyError.type}: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}\n`
  )
  if (BrowserWindow.getAllWindows().length === 0) {
    Process.exit(ExitCode.Error)
  }
}
