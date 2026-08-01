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

const HandleMessagePortForExtensionHostHelperProcess =
  await import('../src/parts/HandleMessagePortForExtensionHostHelperProcess/HandleMessagePortForExtensionHostHelperProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('loads the approved helper module before transferring the Electron port', async () => {
  const port = { start(): void {} }

  await HandleMessagePortForExtensionHostHelperProcess.handlePreloadedMessagePortForExtensionHostHelperProcess(
    port,
    '/extensions/builtin.git/client.js',
  )

  expect(invoke).toHaveBeenCalledWith(ipc, 'LoadFile.loadFile', '/extensions/builtin.git/client.js')
  expect(invokeAndTransfer).toHaveBeenCalledWith(ipc, 'HandleElectronMessagePort.handleElectronMessagePort', port, expect.any(Number))
  expect(invoke.mock.invocationCallOrder[0]).toBeLessThan(invokeAndTransfer.mock.invocationCallOrder[0])
})

test('does not transfer the Electron port when loading the helper module fails', async () => {
  invoke.mockRejectedValueOnce(new Error('load failed'))

  await expect(
    HandleMessagePortForExtensionHostHelperProcess.handlePreloadedMessagePortForExtensionHostHelperProcess(
      { start(): void {} },
      '/extensions/builtin.git/client.js',
    ),
  ).rejects.toThrow('load failed')

  expect(invokeAndTransfer).not.toHaveBeenCalled()
  expect(dispose).toHaveBeenCalledTimes(1)
})
