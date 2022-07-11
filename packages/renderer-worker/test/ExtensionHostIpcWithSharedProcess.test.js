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

const ExtensionHostIpcWithSharedProcess = await import(
  '../src/parts/ExtensionHostIpc/ExtensionHostIpcWithSharedProcess.js'
)

test('listen', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ExtensionHostIpcWithSharedProcess.listen()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionHost.start')
})

test('listen - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostIpcWithSharedProcess.listen()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
