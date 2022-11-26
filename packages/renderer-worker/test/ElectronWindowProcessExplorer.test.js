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
const ElectronWindowProcessExplorer = await import(
  '../src/parts/ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.js'
)

test('open - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronWindowProcessExplorer.open()).rejects.toThrowError(
    new Error('Failed to open process explorer: TypeError: x is not a function')
  )
})

test('open', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  await ElectronWindowProcessExplorer.open()
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronWindowProcessExplorer.open'
  )
})
