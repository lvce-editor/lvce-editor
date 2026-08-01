import { beforeEach, expect, jest, test } from '@jest/globals'

const moduleHandleWebSocket = jest.fn()

jest.unstable_mockModule('../src/parts/HandleWebSocketModule/HandleWebSocketModule.js', () => ({
  load: jest.fn(() => ({
    handleWebSocket: moduleHandleWebSocket,
  })),
}))

const HandleWebSocket = await import('../src/parts/HandleWebSocket/HandleWebSocket.js')
const HandleWebSocketModule = await import('../src/parts/HandleWebSocketModule/HandleWebSocketModule.js')
const WebSocketCapabilityRegistry = await import('../src/parts/WebSocketCapabilityRegistry/WebSocketCapabilityRegistry.js')

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

const createMessage = (token: string, url = '/websocket/capability'): any => {
  return {
    headers: {
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
      'sec-websocket-protocol': `lvce-rpc, lvce-capability.${token}`,
    },
    url,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  WebSocketCapabilityRegistry.clear()
})

test('rejects disallowed origin before consuming a capability', async () => {
  const socket = createSocket()
  const token = WebSocketCapabilityRegistry.create('process-explorer')
  const message = createMessage(token)
  message.headers.origin = 'https://evil.example.com'

  await HandleWebSocket.handleWebSocket(socket, message)

  expect(socket.output).toContain('HTTP/1.1 403 Forbidden')
  expect(socket.pause).not.toHaveBeenCalled()
  expect(HandleWebSocketModule.load).not.toHaveBeenCalled()
  expect(WebSocketCapabilityRegistry.consume(token)).toBeDefined()
})

test.each([
  'clipboard-process',
  'extension-host-helper-process',
  'file-system-process',
  'process-explorer',
  'pty-host',
  'search-process',
  'shared-process',
  'terminal-process',
])('rejects raw target-selectable websocket route %s', async (target) => {
  const socket = createSocket()
  const token = WebSocketCapabilityRegistry.create('file-system-process')

  await HandleWebSocket.handleWebSocket(socket, createMessage(token, `/websocket/${target}`))

  expect(socket.output).toContain('HTTP/1.1 403 Forbidden')
  expect(HandleWebSocketModule.load).not.toHaveBeenCalled()
})

test('rejects malformed websocket capability protocols', async () => {
  const token = WebSocketCapabilityRegistry.create('shared-process')
  const message = createMessage(token)
  message.headers['sec-websocket-protocol'] = `lvce-capability.${token}`
  const socket = createSocket()

  await HandleWebSocket.handleWebSocket(socket, message)

  expect(socket.output).toContain('HTTP/1.1 403 Forbidden')
  expect(HandleWebSocketModule.load).not.toHaveBeenCalled()
})

test('consumes a capability and routes only to its stored target', async () => {
  const socket = createSocket()
  const token = WebSocketCapabilityRegistry.create('process-explorer')
  const message = createMessage(token)

  await HandleWebSocket.handleWebSocket(socket, message)

  expect(socket.pause).toHaveBeenCalledTimes(1)
  expect(HandleWebSocketModule.load).toHaveBeenCalledWith('process-explorer')
  expect(message.headers['sec-websocket-protocol']).toBe('lvce-rpc')
  expect(moduleHandleWebSocket).toHaveBeenCalledWith(
    message,
    socket,
    'process-explorer',
    expect.objectContaining({ target: 'process-explorer' }),
  )
})

test('rejects missing, unknown, and replayed capabilities', async () => {
  const token = WebSocketCapabilityRegistry.create('shared-process')
  await HandleWebSocket.handleWebSocket(createSocket(), createMessage(token))

  for (const invalidToken of ['', 'unknown', token]) {
    const socket = createSocket()
    await HandleWebSocket.handleWebSocket(socket, createMessage(invalidToken))
    expect(socket.output).toContain('HTTP/1.1 403 Forbidden')
  }
  expect(moduleHandleWebSocket).toHaveBeenCalledTimes(1)
})
