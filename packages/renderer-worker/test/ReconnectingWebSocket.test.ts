import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentWithWebSocket from '../src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js'
import * as ReconnectingWebSocket from '../src/parts/ReconnectingWebSocket/ReconnectingWebSocket.js'

const originalLocation = globalThis.location
const originalWebSocket = globalThis.WebSocket

class MockWebSocket extends EventTarget {
  static instances: MockWebSocket[] = []

  onclose: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null

  constructor() {
    super()
    MockWebSocket.instances.push(this)
  }

  emitClose(): void {
    const event = new Event('close')
    this.onclose?.(event)
    this.dispatchEvent(event)
  }

  emitOpen(): void {
    this.dispatchEvent(new Event('open'))
  }

  send(): void {}
}

beforeEach(() => {
  jest.useFakeTimers()
  MockWebSocket.instances = []
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: {
      host: 'localhost:3000',
      protocol: 'http:',
    },
  })
  Object.defineProperty(globalThis, 'WebSocket', {
    configurable: true,
    value: MockWebSocket,
  })
})

afterEach(() => {
  jest.useRealTimers()
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: originalLocation,
  })
  Object.defineProperty(globalThis, 'WebSocket', {
    configurable: true,
    value: originalWebSocket,
  })
})

test('preserves event listeners when reconnecting', async () => {
  const webSocket = ReconnectingWebSocket.create('ws://localhost:3000')
  const listener = jest.fn()
  webSocket.addEventListener('open', listener)

  MockWebSocket.instances[0].emitClose()
  await jest.advanceTimersByTimeAsync(2000)
  MockWebSocket.instances[1].emitOpen()

  expect(MockWebSocket.instances).toHaveLength(2)
  expect(listener).toHaveBeenCalledTimes(1)
})

test('removes event listeners before reconnecting', async () => {
  const webSocket = ReconnectingWebSocket.create('ws://localhost:3000')
  const listener = jest.fn()
  webSocket.addEventListener('open', listener)
  webSocket.removeEventListener('open', listener)

  MockWebSocket.instances[0].emitClose()
  await jest.advanceTimersByTimeAsync(2000)
  MockWebSocket.instances[1].emitOpen()

  expect(listener).not.toHaveBeenCalled()
})

test('waits for the existing websocket to reconnect during startup', async () => {
  const ipcPromise = IpcParentWithWebSocket.create({
    type: 'shared-process',
  })

  MockWebSocket.instances[0].emitClose()
  await jest.advanceTimersByTimeAsync(2000)
  MockWebSocket.instances[1].emitOpen()

  const webSocket = await ipcPromise
  expect(MockWebSocket.instances).toHaveLength(2)
  expect(webSocket.webSocket).toBe(MockWebSocket.instances[1])
})
