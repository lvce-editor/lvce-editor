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
const ElectronWindowProcessExplorer = await import('../src/parts/ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.js')

test('open - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronWindowProcessExplorer.open()).rejects.toThrow(new Error('Failed to open process explorer: TypeError: x is not a function'))
})

test('open', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ElectronWindowProcessExplorer.open()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronWindowProcessExplorer.open')
})
