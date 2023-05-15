import { jest } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import { VError } from '../src/parts/VError/VError.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getText: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    error: jest.fn(),
    warn: jest.fn(),
  }
})

const Ajax = await import('../src/parts/Ajax/Ajax.js')
const Command = await import('../src/parts/Command/Command.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

beforeAll(() => {
  Command.setLoad((moduleId) => {
    switch (moduleId) {
      case ModuleId.Notification:
        return import('../src/parts/Notification/Notification.ipc.js')
      default:
        throw new Error(`module not found ${moduleId}`)
    }
  })
})

test('handleError - normal error', async () => {
  const mockError = new Error('oops')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(expect.stringMatching(/^Error: oops/))
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(/* Notification.create */ 'Notification.create', 'error', 'Error: oops')
})

test('handleError - null', async () => {
  const mockError = null
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith('null')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(/* Notification.create */ 'Notification.create', 'error', 'Error: null')
})

test('handleError - multiple causes', async () => {
  const mockError1 = new Error('SyntaxError: Unexpected token , in JSON at position 7743')
  // @ts-ignore
  const mockError2 = new Error('Failed to load url /keyBindings.json', {
    cause: mockError1,
  })
  // @ts-ignore
  const mockError3 = new Error('Failed to load keybindings', {
    cause: mockError2,
  })
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return ''
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError3)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(
    expect.stringMatching(
      'Error: Failed to load keybindings: Error: Failed to load url /keyBindings.json: Error: SyntaxError: Unexpected token , in JSON at position 7743'
    )
  )
  // expect(spy).toHaveBeenCalledWith(mockError2)
  // expect(spy).toHaveBeenCalledWith(mockError1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Notification.create */ 'Notification.create',
    'error',
    'Error: Failed to load keybindings: Error: Failed to load url /keyBindings.json: Error: SyntaxError: Unexpected token , in JSON at position 7743'
  )
})

test('handleError - with code frame, error stack includes message', async () => {
  const mockError = new Error()
  mockError.name = 'VError'
  mockError.message = `Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"`
  mockError.stack = `VError: Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`
  // @ts-ignore
  mockError.codeFrame = `  62 |     await loadCommand(command)
  63 |     if (!(command in commands)) {
> 64 |       throw new Error(\`Unknown command "\${command}"\`)
     |             ^
  65 |     }
  66 |   }
  67 |   return commands[command](...args)`
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(`Error: Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"

  62 |     await loadCommand(command)
  63 |     if (!(command in commands)) {
> 64 |       throw new Error(\`Unknown command "\${command}"\`)
     |             ^
  65 |     }
  66 |   }
  67 |   return commands[command](...args)

  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`)
})

test('handleUnhandledError - five parameters', async () => {
  const message = `Uncaught VError: failed to parse json: SyntaxError: Unexpected token 'o', "[object Blob]" is not valid JSON`
  const filename = '/test/packages/renderer-worker/src/parts/Json/Json.js'
  const lineno = 17
  const colno = 11
  const error = new VError(`VError: failed to parse json: SyntaxError: Unexpected token 'o', "[object Blob]" is not valid JSON`)
  error.stack = `VError: failed to parse json: SyntaxError: Unexpected token 'o', "[object Blob]" is not valid JSON
    at JSON.parse (<anonymous>)
    at Module.parse (/test/packages/renderer-worker/src/parts/Json/Json.js:15:17)
    at WebSocket.handleMessage (/test/packages/renderer-worker/src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js:31:34)`
  let _resolve
  const promise = new Promise((r) => {
    _resolve = r
  })
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    setTimeout(() => {
      _resolve(undefined)
    }, 0)
    return `import { VError } from '../VError/VError.js'
import * as Character from '../Character/Character.js'

export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + Character.NewLine
}

export const stringifyCompact = (value) => {
  return JSON.stringify(value)
}

export const parse = (content) => {
  // TODO use better json parse to throw more helpful error messages if json is invalid
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new VError(error, 'failed to parse json')
  }
}
`
  })
  const returnValue = ErrorHandling.handleUnhandledError(message, filename, lineno, colno, error)
  expect(returnValue).toBe(true)
  await promise
  // await promise
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(
    `[renderer-worker] Unhandled Error: VError: failed to parse json: SyntaxError: Unexpected token 'o', \"[object Blob]\" is not valid JSON

  13 |   // TODO use better json parse to throw more helpful error messages if json is invalid
  14 |   try {
> 15 |     return JSON.parse(content)
     |                 ^
  16 |   } catch (error) {
  17 |     throw new VError(error, 'failed to parse json')
  18 |   }

    at JSON.parse (<anonymous>)
    at parse (/test/packages/renderer-worker/src/parts/Json/Json.js:15:17)
    at WebSocket.handleMessage (/test/packages/renderer-worker/src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js:31:34)`
  )
})
