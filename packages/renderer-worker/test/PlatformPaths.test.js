import { jest } from '@jest/globals'

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
