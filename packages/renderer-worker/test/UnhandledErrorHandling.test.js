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

class PromiseRejectionEvent extends Event {
  constructor(type, options) {
    super(type, options)
    this.reason = options.reason
  }
}

const Ajax = await import('../src/parts/Ajax/Ajax.js')
const Command = await import('../src/parts/Command/Command.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const UnhandledErrorHandling = await import('../src/parts/UnhandledErrorHandling/UnhandledErrorHandling.js')

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
  const returnValue = UnhandledErrorHandling.handleUnhandledError(message, filename, lineno, colno, error)
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

test('handleUnhandledRejection - prevent default', async () => {
  const error = new TypeError(`Cannot read properties of undefined (reading 'hovered')`)
  error.stack = `TypeError: Cannot read properties of undefined (reading 'hovered')
    at handleTabsPointerOut (/test/packages/renderer-worker/src/parts/ViewletMain/ViewletMainHandleTabsPointerOut.js:13:15)
    at executeViewletCommand (/test/packages/renderer-worker/src/parts/Viewlet/Viewlet.js:358:26)
    at async handleMessageFromRendererProcess (/test/packages/renderer-worker/src/parts/HandleIpc/HandleIpc.js:33:5)`
  const event = new PromiseRejectionEvent('', {
    reason: error,
  })
  let _resolve
  const promise = new Promise((r) => {
    _resolve = r
  })
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    setTimeout(() => {
      _resolve(undefined)
    }, 0)
    return ``
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  UnhandledErrorHandling.handleUnhandledRejection(event)
  await promise
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(
    `[renderer-worker] Unhandled Rejection: TypeError: Cannot read properties of undefined (reading 'hovered')
    at handleTabsPointerOut (/test/packages/renderer-worker/src/parts/ViewletMain/ViewletMainHandleTabsPointerOut.js:13:15)
    at executeViewletCommand (/test/packages/renderer-worker/src/parts/Viewlet/Viewlet.js:358:26)
    at async handleMessageFromRendererProcess (/test/packages/renderer-worker/src/parts/HandleIpc/HandleIpc.js:33:5)`
  )
})
