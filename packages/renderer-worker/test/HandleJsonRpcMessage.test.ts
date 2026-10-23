import { expect, jest, test } from '@jest/globals'
import * as HandleJsonRpcMessage from '../src/parts/HandleJsonRpcMessage/HandleJsonRpcMessage.js'

test('responds through a message port', async () => {
  const ipc = {
    postMessage: jest.fn(),
  }

  await HandleJsonRpcMessage.handleJsonRpcMessage(ipc, { id: 1, method: 'Test.get', params: [] }, async () => 'value', jest.fn(), 'test')

  expect(ipc.postMessage).toHaveBeenCalledWith({
    id: 1,
    jsonrpc: '2.0',
    result: 'value',
  })
})

test('preserves the send-based ipc response path', async () => {
  const ipc = {
    send: jest.fn(),
  }

  await HandleJsonRpcMessage.handleJsonRpcMessage(ipc, { id: 1, method: 'Test.get', params: [] }, async () => 'value', jest.fn(), 'test')

  expect(ipc.send).toHaveBeenCalledWith({
    id: 1,
    jsonrpc: '2.0',
    result: 'value',
  })
})

test('ignores the ready handshake message', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const execute = jest.fn()
  const ipc = {
    postMessage: jest.fn(),
  }

  try {
    await HandleJsonRpcMessage.handleJsonRpcMessage(ipc, 'ready', execute, jest.fn(), 'test')

    expect(warn).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
    expect(ipc.postMessage).not.toHaveBeenCalled()
  } finally {
    warn.mockRestore()
  }
})

test('preserves a binary error through structured cloning', async () => {
  const error = Object.defineProperty(new Error('Cannot open binary file'), 'name', { value: 'BinaryFileError' })
  let response: any
  const ipc = {
    postMessage(message): void {
      response = structuredClone(message)
    },
  }
  await HandleJsonRpcMessage.handleJsonRpcMessage(
    ipc,
    { id: 1, method: 'FileSystem.readFile', params: [] },
    async () => {
      throw error
    },
    jest.fn(),
    'test',
  )
  expect(response.error).toMatchObject({ data: { name: 'BinaryFileError' }, message: 'Cannot open binary file' })
})
