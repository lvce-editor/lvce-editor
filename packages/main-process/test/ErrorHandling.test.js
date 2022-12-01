beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('../src/parts/Logger/Logger.js', () => {
  return {
    info: jest.fn(),
    error: jest.fn(),
  }
})
jest.mock('../src/parts/Process/Process.js', () => {
  return {
    exit: jest.fn(),
  }
})

const ErrorHandling = require('../src/parts/ErrorHandling/ErrorHandling.js')
const Logger = require('../src/parts/Logger/Logger.js')
const Process = require('../src/parts/Process/Process.js')

test('handleUncaughtExceptionMonitor', () => {
  const error = new Error('oops')
  ErrorHandling.handleUncaughtExceptionMonitor(error)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(
    '[main process] uncaught exception: Error: oops'
  )
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(error)
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(1)
})

test('handleUnhandledRejection', () => {
  const error = new Error('oops')
  ErrorHandling.handleUnhandledRejection(error)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(
    '[main process] unhandled rejection: Error: oops'
  )
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(error)
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(1)
})
