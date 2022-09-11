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
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'remote',
  }
})

const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const OpenNativeFolder = await import(
  '../src/parts/OpenNativeFolder/OpenNativeFolder.js'
)

test('openNativeFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Native.openFolder':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await OpenNativeFolder.openNativeFolder('/test/my-folder')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'Native.openFolder',
    '/test/my-folder'
  )
})

test('openNativeFolder - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'Native.openFolder':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(OpenNativeFolder.openNativeFolder('abc')).rejects.toThrowError(
    new Error('Failed to open folder abc: TypeError: x is not a function')
  )
})
