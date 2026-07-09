import { Console } from 'node:console'
import { createWriteStream } from 'node:fs'
import { tmpdir } from 'node:os'

// TODO mock this module when used in unit tests

const state = {
  /**
   * @type {Console|undefined}
   */
  console: undefined,
}

const createConsole = () => {
  const logFile = `${tmpdir()}/log-shared-process.txt`
  const writeStream = createWriteStream(logFile)
  const logger = new Console(writeStream)
  return logger
}

const getOrCreateLogger = () => {
  if (!state.console) {
    state.console = createConsole()
  }
  return state.console
}

export const log = (...args) => {
  const logger = getOrCreateLogger()
  logger.log(...args)
  console.log(...args)
}

export const info = (...args) => {
  const logger = getOrCreateLogger()
  logger.info(...args)
  console.info(...args)
}

export const warn = (...args) => {
  const logger = getOrCreateLogger()
  logger.warn(...args)
  console.warn(...args)
}

export const error = (...args) => {
  const logger = getOrCreateLogger()
  logger.error(...args)
  console.error(...args)
}
