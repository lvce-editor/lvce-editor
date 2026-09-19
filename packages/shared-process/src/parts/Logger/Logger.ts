import { Console } from 'node:console'
import { createWriteStream, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'

// TODO mock this module when used in unit tests

const state: any = {
  /**
   * @type {Console|undefined}
   */
  console: undefined,
}

const createConsole = (): any => {
  const directory = fileURLToPath(PlatformPaths.getLogsDir())
  mkdirSync(directory, { recursive: true })
  const logFile = join(directory, 'log-shared-process.txt')
  const writeStream = createWriteStream(logFile, { flags: 'a' })
  const logger = new Console(writeStream)
  return logger
}

const getOrCreateLogger = (): any => {
  if (!state.console) {
    state.console = createConsole()
  }
  return state.console
}

export const log = (...args: any): any => {
  const logger = getOrCreateLogger()
  logger.log(...args)
  console.log(...args)
}

export const info = (...args: any): any => {
  const logger = getOrCreateLogger()
  logger.info(...args)
  console.info(...args)
}

export const warn = (...args: any): any => {
  const logger = getOrCreateLogger()
  logger.warn(...args)
  console.warn(...args)
}

export const error = (...args: any): any => {
  const logger = getOrCreateLogger()
  logger.error(...args)
  console.error(...args)
}
