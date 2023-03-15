import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    info: jest.fn(),
    error: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Process/Process.js', () => {
  return {
    setExitCode: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/PrettyError/PrettyError.js', () => {
  return {
    prepare: jest.fn(),
  }
})

const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const Process = await import('../src/parts/Process/Process.js')
const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')

test('handleUncaughtExceptionMonitor', () => {
  const error = new Error('oops')
  // @ts-ignore
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'oops',
      stack: `    at main (/test/packages/shared-process/src/sharedProcessMain.js:19:11)`,
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
  expect(Logger.info).toHaveBeenCalledWith('[shared process] uncaught exception: Error: oops')
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenNthCalledWith(
    1,
    `  17 |
  18 |   if (Math) {
> 19 |     throw new Error('oops')
     |           ^
  20 |   }
  21 | }
  22 |
    at main (/test/packages/shared-process/src/sharedProcessMain.js:19:11)
`
  )
  expect(Process.setExitCode).toHaveBeenCalledTimes(1)
  expect(Process.setExitCode).toHaveBeenCalledWith(1)
})
