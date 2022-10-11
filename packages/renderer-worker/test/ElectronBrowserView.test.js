import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ElectronProcess/ElectronProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ElectronProcess = await import(
  '../src/parts/ElectronProcess/ElectronProcess.js'
)
const ElectronBrowserView = await import(
  '../src/parts/ElectronBrowserView/ElectronBrowserView.js'
)

test('createBrowserView - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ElectronBrowserView.createBrowserView('', 0, 0, 0, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('createBrowserView', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  expect(await ElectronBrowserView.createBrowserView('', 0, 0, 0, 0)).toBe(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronBrowserView.createBrowserView',
    '',
    0,
    0,
    0,
    0
  )
})
