import { expect, jest, test } from '@jest/globals'
const ipc = { id: 'test-worker' }
const invoke = jest.fn<(ipc: unknown, command: string, windowId: number) => Promise<void>>(async () => undefined)
jest.unstable_mockModule('../src/parts/GetWindowId/GetWindowId.js', () => ({ getWindowId: async () => 17 }))
jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({ create: async () => ipc }))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({ handleIpc: jest.fn() }))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({ get: () => undefined }))
jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({ invoke }))
const { launchEmbedsWorker } = await import('../src/parts/LaunchEmbedsWorker/LaunchEmbedsWorker.js')
test('initializes the embeds connection with its native window owner', async () => {
  expect(await launchEmbedsWorker()).toBe(ipc)
  expect(invoke).toHaveBeenCalledWith(ipc, 'Initialize.initialize', 17)
})
