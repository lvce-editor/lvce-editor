import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'
import { JsonRpcError } from '../src/parts/JsonRpcError/JsonRpcError.js'
import * as JsonRpc from '../src/parts/JsonRpc/JsonRpc.js'
import * as JsonRpcErrorCode from '../src/parts/JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

class NoErrorThrownError extends Error {}

/**
 *
 * @param {any} promise
 * @returns {Promise<Error>}
 *  */
const getError = async (promise) => {
  try {
    await promise
    throw new NoErrorThrownError()
  } catch (error) {
    // @ts-ignore
    return error
  }
}

test('send', async () => {
  const mockTransport = {
    send: jest.fn(),
  }
  JsonRpc.send(mockTransport, 'Test.execute', 'test message')
  expect(mockTransport.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - string', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: 'something went wrong',
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error.message).toBe('JsonRpc Error: something went wrong')
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - TypeError', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            type: 'TypeError',
            message: 'x is not a function',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(TypeError)
  expect(error.message).toBe('x is not a function')
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - TypeError object', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            message: "Cannot set properties of undefined (setting 'id')",
            stack:
              "TypeError: Cannot set properties of undefined (setting 'id')\n    at Module.setFocusedIndex (/packages/renderer-process/src/parts/ViewletExplorer/ViewletExplorer.js:179:20)\n    at invoke",
            name: 'TypeError',
            type: 'TypeError',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(TypeError)
  expect(error.message).toBe(`Cannot set properties of undefined (setting 'id')`)
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - SyntaxError', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            type: 'SyntaxError',
            message: 'unexpected token',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(SyntaxError)
  expect(error.message).toBe('unexpected token')
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - ReferenceError', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            type: 'ReferenceError',
            message: 'x is not defined',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(ReferenceError)
  expect(error.message).toBe('x is not defined')
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - null', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: null,
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error.message).toBe('JsonRpc Error: null')
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - empty object', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {},
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error.message).toBe(`JsonRpc Error: [object Object]`)
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - error - DOMException', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            type: 'DOMException',
            name: 'AbortError',
            message: 'The user aborted a request.',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(DOMException)
  expect(error.name).toBe('AbortError')
  expect(error.message).toBe(`The user aborted a request.`)
})

test('invoke - error - with stack', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            message: 'Test failed: sample.tab-completion-provider: expected selector .Viewlet.Editor to have text "test3" but was "test"',
            stack: `Error: expected selector .Viewlet.Editor to have text "test3" but was "test"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)`,
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(`Test failed: sample.tab-completion-provider: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"`)
  expect(error.stack).toMatch(
    `Error: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)
    at constructError`
  )
})

test.skip('invoke - error - with only one line in stack', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            message: 'The user aborted a request.',
            name: 'AbortError',
            stack: 'Error: The user aborted a request.',
            type: 'DOMException',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(DOMException)
  expect(error.message).toBe('The user aborted a request.')
  expect(error.stack).toMatch(
    `Error: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)
    at constructError`
  )
})

test('invoke - error - method not found', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            message: 'method not found',
            code: JsonRpcErrorCode.MethodNotFound,
            data: '',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(JsonRpcError)
  expect(error.message).toBe('method not found')
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          result: 'success',
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  expect(await JsonRpc.invoke(ipc, 'Test.execute', 'test message')).toEqual('success')
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})

test('invoke - result is of type number', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          result: 0,
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  expect(await JsonRpc.invoke(ipc, 'Test.execute', 'test message')).toEqual(0)
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 'Test.execute',
    params: ['test message'],
  })
})
