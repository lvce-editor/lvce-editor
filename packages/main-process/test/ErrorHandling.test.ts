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
    exit: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/PrettyError/PrettyError.js', () => {
  return {
    prepare: jest.fn(),
  }
})

jest.unstable_mockModule('electron', () => {
  return {
    BrowserWindow: {
      getAllWindows() {
        return []
      },
    },
  }
})

const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const Process = await import('../src/parts/Process/Process.js')
const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')

test.skip('handleUncaughtExceptionMonitor', () => {
  const error = new Error('oops')
  // @ts-expect-error
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'oops',
      stack: 'at main (/test/packages/main-process/src/mainProcessMain.js:19:11)',
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
  expect(Logger.info).toHaveBeenCalledWith('[main process] uncaught exception: Error: oops')
  expect(Logger.error).toHaveBeenCalledTimes(2)
  expect(Logger.error).toHaveBeenNthCalledWith(
    1,
    `  17 |
  18 |   if (Math) {
> 19 |     throw new Error('oops')
     |           ^
  20 |   }
  21 | }
  22 |`,
  )
  expect(Logger.error).toHaveBeenNthCalledWith(2, 'at main (/test/packages/main-process/src/mainProcessMain.js:19:11)')
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(1)
})

test.skip('handleUnhandledRejection', () => {
  // @ts-expect-error
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'oops',
      stack: 'at main (/test/packages/main-process/src/mainProcessMain.js:19:11)',
      codeFrame: `    17 |
    18 |   if (Math) {
  > 19 |     throw new Error('oops')
       |           ^
    20 |   }
    21 | }
    22 |`,
      type: 'Error',
    }
  })
  const error = new Error('oops')
  ErrorHandling.handleUnhandledRejection(error)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenNthCalledWith(
    1,
    `[main process] unhandled rejection: Error: oops

    17 |
    18 |   if (Math) {
  > 19 |     throw new Error('oops')
       |           ^
    20 |   }
    21 | }
    22 |

at main (/test/packages/main-process/src/mainProcessMain.js:19:11)
`,
  )
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(1)
})

test.skip('handleUnhandledRejection - syntax error', () => {
  // @ts-expect-error
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'Cannot use import statement outside a module',
      stack: `    at/test/packages/main-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:1
    at async Promise.all (index 0)`,
      codeFrame: `> 1 | import * as Assert from '../Assert/Assert.js'
    | ^
  2 | import { Worker } from 'node:worker_threads'
  3 | const GetFirstNodeWorkerEvent = require('../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')
  4 |`,
      type: 'SyntaxError',
    }
  })
  const error = new SyntaxError('Cannot use import statement outside a module')
  error.stack = `/test/packages/main-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:1
import * as Assert from '../Assert/Assert.js'
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:169:29)
    at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
    at async Promise.all (index 0)'`
  ErrorHandling.handleUnhandledRejection(error)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenNthCalledWith(
    1,
    `[main process] unhandled rejection: SyntaxError: Cannot use import statement outside a module

> 1 | import * as Assert from '../Assert/Assert.js'
    | ^
  2 | import { Worker } from 'node:worker_threads'
  3 | const GetFirstNodeWorkerEvent = require('../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')
  4 |

    at/test/packages/main-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:1
    at async Promise.all (index 0)
`,
  )
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(1)
})
