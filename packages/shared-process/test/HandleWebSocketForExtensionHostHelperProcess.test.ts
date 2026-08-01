import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (..._args: readonly unknown[]): Promise<unknown> => undefined)
const invokeAndTransfer = jest.fn(async (..._args: readonly unknown[]): Promise<unknown> => undefined)
const dispose = jest.fn()
const ipc = { dispose }

jest.unstable_mockModule('../src/parts/ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js', () => ({
  create: jest.fn(async () => ipc),
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke,
  invokeAndTransfer,
}))

const HandleWebSocketForExtensionHostHelperProcess =
  await import('../src/parts/HandleWebSocketForExtensionHostHelperProcess/HandleWebSocketForExtensionHostHelperProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('loads the approved helper module before transferring the websocket', async () => {
  const message = { headers: {} }
  const socket = { pause(): void {} }

  await HandleWebSocketForExtensionHostHelperProcess.handleWebSocket(message, socket, 'extension-host-helper-process', {
    expiresAt: Date.now() + 60_000,
    extensionId: 'builtin.git',
    modulePath: '/extensions/builtin.git/client.js',
    rpcId: 'git-client',
    target: 'extension-host-helper-process',
  })

  expect(invoke).toHaveBeenCalledWith(ipc, 'LoadFile.loadFile', '/extensions/builtin.git/client.js')
  expect(invokeAndTransfer).toHaveBeenCalledWith(ipc, 'HandleWebSocket.handleWebSocket', socket, message)
  expect(invoke.mock.invocationCallOrder[0]).toBeLessThan(invokeAndTransfer.mock.invocationCallOrder[0])
})

test('does not transfer the websocket when loading the helper module fails', async () => {
  invoke.mockRejectedValueOnce(new Error('load failed'))

  await expect(
    HandleWebSocketForExtensionHostHelperProcess.handleWebSocket({}, {}, 'extension-host-helper-process', {
      expiresAt: Date.now() + 60_000,
      modulePath: '/extensions/builtin.git/client.js',
      target: 'extension-host-helper-process',
    }),
  ).rejects.toThrow('load failed')

  expect(invokeAndTransfer).not.toHaveBeenCalled()
  expect(dispose).toHaveBeenCalledTimes(1)
})
