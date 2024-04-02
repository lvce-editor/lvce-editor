import { expect, jest, test, beforeEach } from '@jest/globals'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.resetAllMocks()
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.ts', () => {
  return {
    handleIpc: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.ts', () => {
  return {
    create: jest.fn(),
  }
})

const LaunchTerminalProcess = await import('../src/parts/LaunchTerminalProcess/LaunchTerminalProcess.ts')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.ts')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.ts')

test('launchTerminalProcess - error', async () => {
  jest.spyOn(IpcParent, 'create').mockRejectedValue(new TypeError('x is not a function'))
  await expect(LaunchTerminalProcess.launchTerminalProcess()).rejects.toThrow(
    new Error('Failed to create terminal connection: TypeError: x is not a function'),
  )
})

test('launchTerminalProcess', async () => {
  const mockIpc = {}
  jest.spyOn(IpcParent, 'create').mockResolvedValue(mockIpc)
  await LaunchTerminalProcess.launchTerminalProcess()
  expect(HandleIpc.handleIpc).toHaveBeenCalledTimes(1)
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
})
