import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'
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
  const message = 'Uncaught VError: failed to parse json: SyntaxError: Unexpected token \'o\', "[object Blob]" is not valid JSON'
  const filename = '/test/packages/renderer-worker/src/parts/Json/Json.js'
  const lineno = 17
  const colno = 11
  const error = new VError('VError: failed to parse json: SyntaxError: Unexpected token \'o\', "[object Blob]" is not valid JSON')
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
    at WebSocket.handleMessage (/test/packages/renderer-worker/src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js:31:34)`,
  )
})

test('handleUnhandledRejection - prevent default', async () => {
  const error = new TypeError("Cannot read properties of undefined (reading 'hovered')")
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
    return ''
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
    at async handleMessageFromRendererProcess (/test/packages/renderer-worker/src/parts/HandleIpc/HandleIpc.js:33:5)`,
  )
})

test('handleUnhandledRejection - bulk replacement error', async () => {
  const error = new Error()
  error.message = "VError: Bulk replacement failed: File not found: './test.txt'"
  error.stack = `Error: VError: Bulk replacement failed: File not found: './test.txt'
    at constructError (http://localhost:3000/packages/renderer-worker/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:15:19)
    at Module.restoreJsonRpcError (http://localhost:3000/packages/renderer-worker/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:44:27)
    at Module.unwrapJsonRpcResult (http://localhost:3000/packages/renderer-worker/src/parts/UnwrapJsonRpcResult/UnwrapJsonRpcResult.js:6:47)
    at Module.invoke (http://localhost:3000/packages/renderer-worker/src/parts/JsonRpc/JsonRpc.js:14:38)
    at async Module.invoke (http://localhost:3000/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js:45:18)
    at async applyBulkReplacement (http://localhost:3000/packages/renderer-worker/src/parts/BulkReplacement/BulkReplacement.js:8:3)
    at async Module.replaceAll (http://localhost:3000/packages/renderer-worker/src/parts/TextSearchReplaceAll/TextSearchReplaceAll.js:6:3)
    at async Module.replaceAllAndPrompt (http://localhost:3000/packages/renderer-worker/src/parts/ReplaceAllAndPrompt/ReplaceAllAndPrompt.js:28:3)
    at async replaceAll (http://localhost:3000/packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchReplaceAll.js:6:20)
    at async executeViewletCommand (http://localhost:3000/packages/renderer-worker/src/parts/Viewlet/Viewlet.js:359:20)`
  const event = new PromiseRejectionEvent('unhandledrejection', {
    reason: error,
  })
  let _resolve
  const promise = new Promise((r) => {
    _resolve = r
  })
  // @ts-ignore
  Ajax.getText.mockImplementation(async () => {
    setTimeout(() => {
      _resolve('')
    }, 0)
    return ''
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  UnhandledErrorHandling.handleUnhandledRejection(event)
  await promise
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(
    `[renderer-worker] Unhandled Rejection: Error: VError: Bulk replacement failed: File not found: './test.txt'
    at constructError (http://localhost:3000/packages/renderer-worker/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:15:19)
    at async invoke (http://localhost:3000/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js:45:18)
    at async applyBulkReplacement (http://localhost:3000/packages/renderer-worker/src/parts/BulkReplacement/BulkReplacement.js:8:3)
    at async replaceAll (http://localhost:3000/packages/renderer-worker/src/parts/TextSearchReplaceAll/TextSearchReplaceAll.js:6:3)
    at async replaceAllAndPrompt (http://localhost:3000/packages/renderer-worker/src/parts/ReplaceAllAndPrompt/ReplaceAllAndPrompt.js:28:3)
    at async replaceAll (http://localhost:3000/packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchReplaceAll.js:6:20)
    at async executeViewletCommand (http://localhost:3000/packages/renderer-worker/src/parts/Viewlet/Viewlet.js:359:20)`,
  )
})
