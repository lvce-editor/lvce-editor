import { setTimeout } from 'node:timers/promises'
import { jest } from '@jest/globals'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetErrorResponse/GetErrorResponse.js', () => ({
  getErrorResponse: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetResponse/GetResponse.js', () => ({
  getResponse: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => ({
  logError: jest.fn(),
}))

const GetResponse = await import('../src/parts/GetResponse/GetResponse.js')
const GetErrorResponse = await import('../src/parts/GetErrorResponse/GetErrorResponse.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')

const Rpc = await import('../src/parts/Rpc/Rpc.js')

test('send - error - promise could not be cloned', async () => {
  const mockResult = Promise.resolve()
  // @ts-ignore
  GetResponse.getResponse.mockImplementation((message) => {
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message,
      result: mockResult,
    }
  })
  // @ts-ignore
  GetErrorResponse.getErrorResponse.mockImplementation((message, error) => {
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      error: {
        message: `${error}`,
      },
    }
  })
  let i = 0
  const ipc = {
    _onmessage: null,
    get onmessage() {
      return this._onmessage
    },
    set onmessage(listener) {
      this._onmessage = listener
    },
    send: jest.fn(() => {
      if (i++ === 0) {
        throw new DOMException("Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': #<Promise> could not be cloned.")
      }
    }),
  }
  Rpc.listen(ipc)
  // @ts-ignore
  ipc._onmessage({
    data: {
      jsonrpc: JsonRpcVersion.Two,
      method: 'test',
      params: [],
      id: 1,
    },
  })
  await setTimeout(0)
  expect(ipc.send).toHaveBeenCalledTimes(2)
  expect(ipc.send).toHaveBeenNthCalledWith(1, {
    id: {
      id: 1,
      jsonrpc: JsonRpcVersion.Two,
      method: 'test',
      params: [],
    },
    jsonrpc: JsonRpcVersion.Two,
    result: mockResult,
  })
  expect(ipc.send).toHaveBeenNthCalledWith(2, {
    error: {
      message: "Error: Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': #<Promise> could not be cloned.",
    },
    id: 1,
    jsonrpc: JsonRpcVersion.Two,
  })
  expect(ErrorHandling.logError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.logError).toHaveBeenCalledWith(
    new DOMException("Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': #<Promise> could not be cloned.")
  )
})

test('send', async () => {
  // @ts-ignore
  GetResponse.getResponse.mockImplementation((message) => {
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      result: 42,
    }
  })
  const ipc = {
    _onmessage: null,
    get onmessage() {
      return this._onmessage
    },
    set onmessage(listener) {
      this._onmessage = listener
      // @ts-ignore
    },
    send: jest.fn(() => {}),
  }
  Rpc.listen(ipc)
  // @ts-ignore
  ipc._onmessage({
    data: {
      jsonrpc: JsonRpcVersion.Two,
      method: 'test',
      params: [],
      id: 1,
    },
  })
  await setTimeout(0)
  expect(ipc.send).toHaveBeenCalledTimes(1)
  expect(ipc.send).toHaveBeenNthCalledWith(1, {
    jsonrpc: JsonRpcVersion.Two,
    id: 1,
    result: 42,
  })
})
