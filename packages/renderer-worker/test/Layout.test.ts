import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => {
  return {
    getApplicationName: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Layout = await import('../src/parts/Layout/Layout.js')
const LayoutIpc = await import('../src/parts/Layout/Layout.ipc.js')
const PlatformPaths = await import('../src/parts/PlatformPaths/PlatformPaths.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('gets the application name from platform paths', async () => {
  // @ts-ignore
  PlatformPaths.getApplicationName.mockResolvedValue('test-app')

  await expect(Layout.getApplicationName()).resolves.toBe('test-app')
  expect(PlatformPaths.getApplicationName).toHaveBeenCalledTimes(1)
  expect(LayoutIpc.Commands.getApplicationName).toBe(Layout.getApplicationName)
})
