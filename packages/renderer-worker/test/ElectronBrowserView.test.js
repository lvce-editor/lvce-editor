import { beforeEach, expect, jest, test } from '@jest/globals'

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
const ElectronBrowserView = await import('../src/parts/ElectronBrowserView/ElectronBrowserView.js')

test.skip('createBrowserView - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  await expect(ElectronBrowserView.createBrowserView(0, [])).rejects.toThrow(new TypeError('x is not a function'))
})

test.skip('createBrowserView', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  await ElectronBrowserView.createBrowserView(0, [])
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronBrowserView.createBrowserView', 0, [])
})
