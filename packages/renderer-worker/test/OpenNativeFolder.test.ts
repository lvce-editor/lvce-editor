import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

const getPlatform = jest.fn(() => PlatformType.Remote)
const getOpenExternalPath = jest.fn<(path: string) => Promise<string>>()
const showItemInFolder = jest.fn<(path: string) => Promise<void>>()

beforeEach(() => {
  jest.resetAllMocks()
  getPlatform.mockReturnValue(PlatformType.Remote)
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform,
    platform: PlatformType.Remote,
  }
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostFileSystem.js', () => ({ getOpenExternalPath }))
jest.unstable_mockModule('../src/parts/OpenExternal/OpenExternal.js', () => ({ showItemInFolder }))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const OpenNativeFolder = await import('../src/parts/OpenNativeFolder/OpenNativeFolder.js')

test('openNativeFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'OpenNativeFolder.openFolder':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await OpenNativeFolder.openNativeFolder('/test/my-folder')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('OpenNativeFolder.openFolder', '/test/my-folder')
})

test('openNativeFolder resolves provider URIs before invoking the native shell', async () => {
  getPlatform.mockReturnValue(PlatformType.Electron)
  getOpenExternalPath.mockResolvedValue('\\\\wsl.localhost\\Ubuntu\\workspace')

  await OpenNativeFolder.openNativeFolder('wsl://Ubuntu/workspace')

  expect(getOpenExternalPath).toHaveBeenCalledWith('wsl://Ubuntu/workspace')
  expect(showItemInFolder).toHaveBeenCalledWith('\\\\wsl.localhost\\Ubuntu\\workspace')
})

test('openNativeFolder preserves local paths for the native shell', async () => {
  getPlatform.mockReturnValue(PlatformType.Electron)

  await OpenNativeFolder.openNativeFolder('C:\\workspace')

  expect(getOpenExternalPath).not.toHaveBeenCalled()
  expect(showItemInFolder).toHaveBeenCalledWith('C:\\workspace')
})

test('openNativeFolder - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'OpenNativeFolder.openFolder':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(OpenNativeFolder.openNativeFolder('abc')).rejects.toThrow(new Error('Failed to open folder abc: TypeError: x is not a function'))
})
