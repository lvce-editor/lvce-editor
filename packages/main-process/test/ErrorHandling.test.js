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

jest.mock('../src/parts/PrettyError/PrettyError.js', () => {
  return {
    prepare: jest.fn(),
  }
})

const ErrorHandling = require('../src/parts/ErrorHandling/ErrorHandling.js')
const Logger = require('../src/parts/Logger/Logger.js')
const Process = require('../src/parts/Process/Process.js')
const PrettyError = require('../src/parts/PrettyError/PrettyError.js')

test('handleUncaughtExceptionMonitor', () => {
  const error = new Error('oops')
  // @ts-ignore
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'oops',
      stack: `at main (/test/packages/main-process/src/mainProcessMain.js:19:11)`,
      codeFrame: `  17 |
  18 |   if (Math) {
> 19 |     throw new Error('oops')
     |           ^
  20 |   }
  21 | }
  22 |`,
    }
  })
  ErrorHandling.handleUncaughtExceptionMonitor(error)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(
    '[main process] uncaught exception: Error: oops'
  )
  expect(Logger.error).toHaveBeenCalledTimes(2)
  expect(Logger.error).toHaveBeenNthCalledWith(
    1,
    `  17 |
  18 |   if (Math) {
> 19 |     throw new Error('oops')
     |           ^
  20 |   }
  21 | }
  22 |`
  )
  expect(Logger.error).toHaveBeenNthCalledWith(
    2,
    `at main (/test/packages/main-process/src/mainProcessMain.js:19:11)`
  )
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(1)
})

test('handleUnhandledRejection', () => {
  // @ts-ignore
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'oops',
      stack: `at main (/test/packages/main-process/src/mainProcessMain.js:19:11)`,
      codeFrame: `  17 |
    18 |   if (Math) {
  > 19 |     throw new Error('oops')
       |           ^
    20 |   }
    21 | }
    22 |`,
    }
  })
  const error = new Error('oops')
  ErrorHandling.handleUnhandledRejection(error)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(
    '[main process] unhandled rejection: Error: oops'
  )
  expect(Logger.error).toHaveBeenCalledTimes(2)
  expect(Logger.error).toHaveBeenNthCalledWith(
    1,
    `  17 |
    18 |   if (Math) {
  > 19 |     throw new Error('oops')
       |           ^
    20 |   }
    21 | }
    22 |`
  )
  expect(Logger.error).toHaveBeenNthCalledWith(
    2,
    `at main (/test/packages/main-process/src/mainProcessMain.js:19:11)`
  )
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(1)
})
