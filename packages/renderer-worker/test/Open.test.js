import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: PlatformType.Remote,
    getPlatform: jest.fn(() => {
      return PlatformType.Remote
    }),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

const Open = await import('../src/parts/Open/Open.js')

test('openUrl - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(Open.openUrl('test://test.txt')).rejects.toThrow(new Error('Failed to open url test://test.txt: TypeError: x is not a function'))
})

test('openUrl', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Open.openUrl('test://test.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Open.openUrl', 'test://test.txt')
})
