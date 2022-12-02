const { dialog } = require('electron')
const Logger = require('../Logger/Logger.js')
const Process = require('../Process/Process.js')
const PrettyError = require('../PrettyError/PrettyError.js')

const getDisplayMessage = (error) => {
  if (!error || !error.stack) {
    return `<unknown error>`
  }

  return `${error.stack}`
}

const printError = (error) => {
  Logger.error(`[main-process] ${error.stack}`)
}

const showError = (error) => {
  const displayMessage = getDisplayMessage(error)
  dialog.showErrorBox('Error', displayMessage)
}

exports.handleError = (error) => {
  printError(error)
  showError(error)
}

const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, error.stack.indexOf('\n'))
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
  Process.exit(1)
}

exports.handleUnhandledRejection = (reason, promise) => {
  Logger.info(`[main process] unhandled rejection: ${firstErrorLine(reason)}`)
  const prettyError = PrettyError.prepare(reason)
  Logger.error(prettyError.codeFrame)
  Logger.error(prettyError.stack)
  Process.exit(1)
}
