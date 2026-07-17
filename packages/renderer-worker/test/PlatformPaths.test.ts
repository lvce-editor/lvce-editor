import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

const PlatformPaths = await import('../src/parts/PlatformPaths/PlatformPaths.js')

const PlatformPathsIpc = await import('../src/parts/PlatformPaths/PlatformPaths.ipc.js')

test('exposes getBuiltinExtensionsPath over ipc', () => {
  expect(PlatformPathsIpc.Commands.getBuiltinExtensionsPath).toBe(PlatformPaths.getBuiltinExtensionsPath)
})

test('getBuiltinExtensionsPath', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method) => {
    if (method === 'Platform.getBuiltinExtensionsPath') {
      return '/test/extensions'
    }
    throw new Error('unexpected message')
  })
  expect(await PlatformPaths.getBuiltinExtensionsPath()).toBe('/test/extensions')
})

test('getLogsDir', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getLogsDir':
        return '~/.local/state/app-name'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await PlatformPaths.getLogsDir()).toBe('~/.local/state/app-name')
})

test('getLogsDir - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'Platform.getLogsDir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(PlatformPaths.getLogsDir()).rejects.toThrow(new TypeError('x is not a function'))
})

test('getUserSettingsPath', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getUserSettingsPath':
        return '~/.config/app/settings.json'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await PlatformPaths.getUserSettingsPath()).toBe('~/.config/app/settings.json')
})

test('getConfigJsonPath - web', async () => {
  expect(await PlatformPaths.getConfigJsonPath(PlatformType.Web, '/test/commit-hash')).toBe('/test/commit-hash/config.json')
  expect(SharedProcess.invoke).not.toHaveBeenCalled()
})

test('getConfigJsonPath - electron', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getConfigJsonPath':
        return 'file:///test/config.json'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await PlatformPaths.getConfigJsonPath(PlatformType.Electron)).toBe('file:///test/config.json')
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Platform.getConfigJsonPath')
})

test('getUserSettingsPath - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'Platform.getUserSettingsPath':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(PlatformPaths.getUserSettingsPath()).rejects.toThrow(new TypeError('x is not a function'))
})
