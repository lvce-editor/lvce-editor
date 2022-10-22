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
const ElectronBrowserViewFunctions = await import(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
)

test('focus - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronBrowserViewFunctions.focus()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('focus', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  await ElectronBrowserViewFunctions.focus()
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronBrowserViewFunctions.focus'
  )
})
