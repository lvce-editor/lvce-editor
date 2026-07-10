import { beforeEach, expect, jest, test } from '@jest/globals'

const moduleHandleWebSocket = jest.fn()

jest.unstable_mockModule('../src/parts/HandleWebSocketModule/HandleWebSocketModule.js', () => ({
  load: jest.fn(() => ({
    handleWebSocket: moduleHandleWebSocket,
  })),
}))

const HandleWebSocket = await import('../src/parts/HandleWebSocket/HandleWebSocket.js')
const HandleWebSocketModule = await import('../src/parts/HandleWebSocketModule/HandleWebSocketModule.js')

const createSocket = (): any => {
  let output = ''
  return {
    destroy: jest.fn(),
    end: jest.fn(),
    get output(): string {
      return output
    },
    pause: jest.fn(),
    write: jest.fn((chunk: any) => {
      output += chunk
    }),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('handleWebSocket - rejects disallowed origin before upgrade', async () => {
  const socket = createSocket()
  const message = {
    headers: {
      host: 'localhost:3000',
      origin: 'https://evil.example.com',
    },
    url: '/websocket/process-explorer',
  }

  await HandleWebSocket.handleWebSocket(socket, message)

  expect(socket.output).toContain('HTTP/1.1 403 Forbidden')
  expect(socket.output).toContain('Connection: close')
  expect(socket.output).toContain('Content-Length: 0')
  expect(socket.end).toHaveBeenCalledTimes(1)
  expect(socket.pause).not.toHaveBeenCalled()
  expect(HandleWebSocketModule.load).not.toHaveBeenCalled()
  expect(moduleHandleWebSocket).not.toHaveBeenCalled()
})

test('handleWebSocket - allows process explorer upgrade from same origin', async () => {
  const socket = createSocket()
  const message = {
    headers: {
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
    },
    url: '/websocket/process-explorer',
  }

  await HandleWebSocket.handleWebSocket(socket, message)

  expect(socket.pause).toHaveBeenCalledTimes(1)
  expect(HandleWebSocketModule.load).toHaveBeenCalledWith('process-explorer')
  expect(moduleHandleWebSocket).toHaveBeenCalledWith(message, socket, 'process-explorer')
})

test('handleWebSocket - allows shared process upgrade from forwarded origin', async () => {
  const socket = createSocket()
  const message = {
    headers: {
      host: '127.0.0.1:3000',
      origin: 'https://example-codespace-3000.app.github.dev',
      'x-forwarded-host': 'example-codespace-3000.app.github.dev',
    },
    url: '/websocket/shared-process',
  }

  await HandleWebSocket.handleWebSocket(socket, message)

  expect(socket.pause).toHaveBeenCalledTimes(1)
  expect(HandleWebSocketModule.load).toHaveBeenCalledWith('shared-process')
  expect(moduleHandleWebSocket).toHaveBeenCalledWith(message, socket, 'shared-process')
})
