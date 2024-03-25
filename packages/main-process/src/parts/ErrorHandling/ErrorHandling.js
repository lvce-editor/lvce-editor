import { BrowserWindow } from 'electron'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'
import * as Logger from '../Logger/Logger.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as Process from '../Process/Process.js'

// @ts-ignore
const getDisplayMessage = (error) => {
  if (!error || !error.stack) {
    return `<unknown error>`
  }

  return `${error.stack}`
}

export const handleError = (error) => {
  const prettyError = PrettyError.prepare(error)
  // @ts-ignore
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

// @ts-ignore
export const handleUncaughtExceptionMonitor = (error, origin) => {
  Logger.info(`[main process] uncaught exception: ${firstErrorLine(error)}`)
  const prettyError = PrettyError.prepare(error)
  // @ts-ignore
  Logger.error(prettyError.codeFrame)
  Logger.error(prettyError.stack)
  if (BrowserWindow.getAllWindows().length === 0) {
    Process.exit(ExitCode.Error)
  }
}

// @ts-ignore
export const handleUnhandledRejection = (reason, promise) => {
  const prettyError = PrettyError.prepare(reason)
  Logger.error(
    // @ts-ignore
    `[main process] unhandled rejection: ${prettyError.type}: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}\n`,
  )
  if (BrowserWindow.getAllWindows().length === 0) {
    Process.exit(ExitCode.Error)
  }
}
