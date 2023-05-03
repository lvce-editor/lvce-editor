// TODO mock this module when used in unit tests

const state = {
  /**
   * @type {Console|undefined}
   */
  console: undefined,
}

const createConsole = async () => {
  if (typeof process !== 'undefined') {
    const { Console } = await import('node:console')
    const { createWriteStream } = await import('node:fs')
    const { tmpdir } = await import('node:os')
    const logFile = `${tmpdir()}/log-extension-host-helper-process.txt`
    const writeStream = createWriteStream(logFile)
    const logger = new Console(writeStream)
    return logger
  }
  return console
}

const getOrCreateLogger = async () => {
  if (!state.console) {
    state.console = await createConsole()
  }
  return state.console
}

export const log = async (...args) => {
  const logger = await getOrCreateLogger()
  logger.log(...args)
  console.log(...args)
}

export const info = async (...args) => {
  const logger = await getOrCreateLogger()
  logger.info(...args)
  console.info(...args)
}

export const warn = async (...args) => {
  const logger = await getOrCreateLogger()
  logger.warn(...args)
  console.warn(...args)
}

export const error = async (...args) => {
  const logger = await getOrCreateLogger()
  logger.error(...args)
  console.error(...args)
}
