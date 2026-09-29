import { expect, jest, test } from '@jest/globals'

const getOrCreate = jest.fn<() => Promise<any>>()
const invokeAndTransfer = jest.fn<(...args: readonly any[]) => Promise<void>>()

jest.unstable_mockModule('../src/parts/CookieImportProcess/CookieImportProcess.ts', () => ({ getOrCreate }))
jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.ts', () => ({ invokeAndTransfer }))

const HandleMessagePortForCookieImportProcess =
  await import('../src/parts/HandleMessagePortForCookieImportProcess/HandleMessagePortForCookieImportProcess.ts')

test('transfers the view port to the cookie import process', async () => {
  const ipc = { send: jest.fn() }
  const port = { postMessage: jest.fn() } as any
  getOrCreate.mockResolvedValue(ipc)
  invokeAndTransfer.mockResolvedValue(undefined)

  await HandleMessagePortForCookieImportProcess.handleMessagePortForCookieImportProcess(port)

  expect(invokeAndTransfer).toHaveBeenCalledWith(ipc, 'HandleElectronMessagePort.handleElectronMessagePort', port)
})
