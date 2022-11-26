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
const ElectronWindowAbout = await import(
  '../src/parts/ElectronWindowAbout/ElectronWindowAbout.js'
)

test('open - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronWindowAbout.open()).rejects.toThrowError(
    new Error('Failed to open about window: TypeError: x is not a function')
  )
})

test('open', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  await ElectronWindowAbout.open()
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronWindowAbout.open'
  )
})
