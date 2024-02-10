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
const ElectronBrowserViewFunctions = await import('../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js')

test('focus - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronBrowserViewFunctions.focus(1)).rejects.toThrow(new TypeError('x is not a function'))
})

test('focus', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ElectronBrowserViewFunctions.focus(1)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronBrowserViewFunctions.focus', 1)
})
