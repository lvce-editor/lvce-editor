const { Console } = require('console')
const { createWriteStream } = require('fs')
const { tmpdir } = require('os')

// TODO disable logging via environment variable, don't enable logging during tests

const state = {
  /**
   * @type {Console|undefined}
   */
  console: undefined,
}

const createConsole = () => {
  const logFile = `${tmpdir()}/log-main-process.txt`
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

exports.log = (...args) => {
  const logger = getOrCreateLogger()
  logger.log(...args)
  console.log(...args)
}

exports.info = (...args) => {
  const logger = getOrCreateLogger()
  logger.info(...args)
  console.info(...args)
}

exports.warn = (...args) => {
  const logger = getOrCreateLogger()
  logger.warn(...args)
  console.warn(...args)
}

exports.error = (...args) => {
  const logger = getOrCreateLogger()
  logger.error(...args)
  console.error(...args)
}

process.stdout.on('close', () => {
  const logger = getOrCreateLogger()
  logger.info('stdout closed')
})
process.stdout.on('exit', () => {
  const logger = getOrCreateLogger()
  logger.info('stdout exited')
})

process.stderr.on('close', () => {
  const logger = getOrCreateLogger()
  logger.info('stderr closed')
})
process.stderr.on('exit', () => {
  const logger = getOrCreateLogger()
  logger.info('stderr exited')
})

process.stdout.on('error', (error) => {
  const logger = getOrCreateLogger()
  logger.error(`[main-process] stdout error: ${error.stack}`)
})

process.stderr.on('error', (error) => {
  const logger = getOrCreateLogger()
  logger.error(`[main-process] stderr error: ${error.stack}`)
})
