import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => ({
  logError: jest.fn(() => {}),
}))

const HandleJsonRpcMessage = await import('../src/parts/HandleJsonRpcMessage/HandleJsonRpcMessage.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')

test('resolve', () => {
  const ipc = {}
  const message = {
    id: 1,
    result: 2,
  }
  const resolve = jest.fn()
  const execute = jest.fn()
  HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, execute, resolve)
  expect(resolve).toHaveBeenCalledTimes(1)
  expect(resolve).toHaveBeenCalledWith(1, message)
})

test('unexpected message', async () => {
  const ipc = {}
  const message = {}
  const resolve = jest.fn()
  const execute = jest.fn()
  await expect(HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, execute, resolve)).rejects.toThrow(
    new Error('unexpected message from renderer worker'),
  )
})

test('error when sending message', async () => {
  let i = 0
  const ipc = {
    send: jest.fn(() => {
      if (i++ === 0) {
        throw new TypeError('x is not a function')
      }
    }),
  }
  const message = {
    id: 1,
    method: 'abc',
    params: [],
  }
  const resolve = jest.fn()
  const execute = jest.fn()
  await HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, execute, resolve)
  expect(ipc.send).toHaveBeenCalledTimes(2)
  expect(ipc.send).toHaveBeenNthCalledWith(1, {
    id: 1,
    jsonrpc: '2.0',
    result: undefined,
  })
  expect(ipc.send).toHaveBeenNthCalledWith(2, {
    error: {
      codeFrame: '',
      message: 'x is not a function',
      name: 'TypeError',
      stack: expect.stringMatching('TypeError: x is not a function'),
      type: 'TypeError',
    },
    id: 1,
    jsonrpc: '2.0',
  })
  expect(ErrorHandling.logError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.logError).toHaveBeenCalledWith(new TypeError('x is not a function'))
})
