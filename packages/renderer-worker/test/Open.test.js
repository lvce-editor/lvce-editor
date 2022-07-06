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

const Open = await import('../src/parts/Open/Open.js')

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
  await Open.openNativeFolder('/test/my-folder')
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
  await expect(Open.openNativeFolder('abc')).rejects.toThrowError(
    new Error('x is not a function')
  )
})

test('openUrl - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(Open.openUrl('test://test.txt')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('openUrl', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Open.openUrl('test://test.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Open.openUrl',
    'test://test.txt'
  )
})
