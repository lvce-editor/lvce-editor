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
