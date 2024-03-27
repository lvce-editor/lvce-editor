import { jest } from '@jest/globals'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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
const ElectronWindowAbout = await import('../src/parts/ElectronWindowAbout/ElectronWindowAbout.js')

test('open - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronWindowAbout.open()).rejects.toThrow(new Error('Failed to open about window: TypeError: x is not a function'))
})

test('open', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ElectronWindowAbout.open()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronWindowAbout.open')
})
