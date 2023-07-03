import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'remote',
    getLogsDir: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getConfigPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
    assetDir: '',
  }
})

const OpenSpecialFolder = await import('../src/parts/OpenSpecialFolder/OpenSpecialFolder.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

test('openConfigFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'OpenNativeFolder.openFolder':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  Platform.getConfigPath.mockImplementation(() => {
    return '/test/config-folder'
  })
  await OpenSpecialFolder.openConfigFolder()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenLastCalledWith('OpenNativeFolder.openFolder', '/test/config-folder')
})

test('openDataFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'OpenNativeFolder.openFolder':
        return null
      case 'Platform.getDataDir':
        return '/test/data-folder'
      default:
        throw new Error('unexpected message')
    }
  })
  await OpenSpecialFolder.openDataFolder()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(2)
  expect(SharedProcess.invoke).toHaveBeenLastCalledWith('OpenNativeFolder.openFolder', '/test/data-folder')
})

test('openLogsFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'OpenNativeFolder.openFolder':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  Platform.getLogsDir.mockImplementation(() => {
    return '~/.local/state/app-name'
  })
  await OpenSpecialFolder.openLogsFolder()
  expect(SharedProcess.invoke).toHaveBeenLastCalledWith('OpenNativeFolder.openFolder', '~/.local/state/app-name')
})

test('openLogsFolder - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'OpenNativeFolder.openFolder':
        return null
      case 'Platform.getLogsDir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  Platform.getLogsDir.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(OpenSpecialFolder.openLogsFolder()).rejects.toThrowError(new TypeError('x is not a function'))
})
