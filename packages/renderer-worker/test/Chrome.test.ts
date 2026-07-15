import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

test('minimize - electron', async () => {
  jest.resetModules()
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
      getPlatform: () => {
        return PlatformType.Electron
      },
    }
  })
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  const CommandAfterReset = await import('../src/parts/Command/Command.js')
  // @ts-ignore
  CommandAfterReset.execute.mockImplementation(() => {})
  // @ts-ignore
  await Chrome.minimize()
  expect(CommandAfterReset.execute).toHaveBeenCalledTimes(1)
  expect(CommandAfterReset.execute).toHaveBeenCalledWith('ElectronWindow.minimize')
})

test('maximize - electron', async () => {
  jest.resetModules()
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
      getPlatform: () => {
        return PlatformType.Electron
      },
    }
  })
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  const CommandAfterReset = await import('../src/parts/Command/Command.js')
  // @ts-ignore
  CommandAfterReset.execute.mockImplementation(() => {})
  await Chrome.maximize()
  expect(CommandAfterReset.execute).toHaveBeenCalledTimes(1)
})

test('unmaximize - electron', async () => {
  jest.resetModules()
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
      getPlatform: () => {
        return PlatformType.Electron
      },
    }
  })
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  const CommandAfterReset = await import('../src/parts/Command/Command.js')
  // @ts-ignore
  CommandAfterReset.execute.mockImplementation(() => {})
  await Chrome.unmaximize()
  expect(CommandAfterReset.execute).toHaveBeenCalledTimes(1)
})

test('close - electron', async () => {
  jest.resetModules()
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
      getPlatform: () => {
        return PlatformType.Electron
      },
    }
  })
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  const CommandAfterReset = await import('../src/parts/Command/Command.js')
  // @ts-ignore
  CommandAfterReset.execute.mockImplementation(() => {})
  await Chrome.close()
  expect(CommandAfterReset.execute).toHaveBeenCalledTimes(1)
})
