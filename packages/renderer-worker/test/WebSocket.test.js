import { jest } from '@jest/globals'
import * as WebSocket from '../src/parts/WebSocket/WebSocket.js'

beforeAll(() => {
  // @ts-ignore
  globalThis.WebSocket = class {
    constructor() {}
    set onmessage(fn) {
      this.messageListener = fn
      this.openListener = null
    }

    send(message) {}
    close() {}

    __mockSend(message) {
      this.messageListener(message)
    }

    set onopen(listener) {
      listener()
    }
  }
})

afterAll(() => {
  delete globalThis.WebSocket
})

test('create', () => {
  const baton = {
    send(message) {},
    receive(message) {},
    dispose() {},
  }
  const originalSend = baton.send
  const originalReceive = baton.receive
  const originalDispose = baton.dispose
  WebSocket.create('ws://example.com', baton)
  expect(baton.send).not.toBe(originalSend)
  expect(baton.receive).toBe(originalReceive)
  expect(baton.dispose).not.toBe(originalDispose)
})

test('send', () => {
  jest
    .spyOn(globalThis.WebSocket.prototype, 'send')
    .mockImplementation(() => {})
  const baton = {
    send(message) {},
    receive(message) {},
    dispose() {},
  }
  WebSocket.create('ws://example.com', baton)
  baton.send('test message')
  expect(globalThis.WebSocket.prototype.send).toHaveBeenCalledWith(
    '"test message"'
  )
  baton.dispose()
})

test('receive', () => {
  const baton = {
    send(message) {},
    receive: jest.fn(),
    dispose() {},
  }
  const state = WebSocket.create('ws://example.com', baton)
  // @ts-ignore
  state.webSocket.__mockSend({
    data: JSON.stringify({
      method: 'Notification.show',
      params: ['test message'],
    }),
  })
  expect(baton.receive).toHaveBeenCalledWith({
    method: 'Notification.show',
    params: ['test message'],
  })
  baton.dispose()
})
