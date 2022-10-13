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

const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const ChromeExtension = await import(
  '../src/parts/ChromeExtension/ChromeExtension.js'
)

test.skip('install', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ChromeExtension.install('test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ChromeExtension.install',
    'test-extension'
  )
})

test('install - not yet supported', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await expect(ChromeExtension.install('test-extension')).rejects.toThrowError(
    new Error('not yet supported: test-extension')
  )
})

test('uninstall', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ChromeExtension.uninstall('test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ChromeExtension.uninstall',
    'test-extension'
  )
})
