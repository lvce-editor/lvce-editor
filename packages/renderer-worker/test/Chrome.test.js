import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
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

const Command = await import('../src/parts/Command/Command.js')

test('minimize - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
    }
  })
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  // @ts-ignore
  await Chrome.minimize()
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ElectronWindow.minimize')
})

test('maximize - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
    }
  })
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await Chrome.maximize()
  expect(Command.execute).toHaveBeenCalledTimes(1)
})

test('unmaximize - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
    }
  })
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await Chrome.unmaximize()
  expect(Command.execute).toHaveBeenCalledTimes(1)
})

test('close - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
    }
  })
  const Chrome = await import('../src/parts/Chrome/Chrome.js')
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await Chrome.close()
  expect(Command.execute).toHaveBeenCalledTimes(1)
})
