import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'
import * as JsonRpc from '../src/parts/JsonRpc/JsonRpc.js'

test('send', async () => {
  const mockTransport = {
    send: jest.fn(),
  }
  JsonRpc.send(mockTransport, 'Notification.show', 'test message')
  expect(mockTransport.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'Notification.show',
    params: ['test message'],
  })
})

test('invoke', async () => {
  const mockTransport = {
    send: jest.fn((message) => {
      if (message.method === 'Notification.show') {
        Callback.resolve(message.id, {
          result: 'success',
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  expect(
    await JsonRpc.invoke(mockTransport, 'Notification.show', 'test message')
  ).toEqual({
    result: 'success',
  })
  expect(mockTransport.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'Notification.show',
    params: ['test message'],
  })
})

test('invoke - error', async () => {
  const mockTransport = {
    send: jest.fn((message) => {
      if (message.method === 'Notification.show') {
        Callback.resolve(message.id, {
          result: 'success',
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  expect(
    await JsonRpc.invoke(mockTransport, 'Notification.show', 'test message')
  ).toEqual({
    result: 'success',
  })
  expect(mockTransport.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'Notification.show',
    params: ['test message'],
  })
})
