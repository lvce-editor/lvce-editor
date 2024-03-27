import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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
const ElectronPowerSaveBlocker = await import('../src/parts/ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.js')

test('start - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronPowerSaveBlocker.start('prevent-app-suspension')).rejects.toThrow(new TypeError('x is not a function'))
})

test('start', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return 1
  })
  expect(await ElectronPowerSaveBlocker.start('prevent-app-suspension')).toBe(1)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronPowerSaveBlocker.start', 'prevent-app-suspension')
})

test('stop - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronPowerSaveBlocker.stop(1)).rejects.toThrow(new TypeError('x is not a function'))
})

test('stop', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ElectronPowerSaveBlocker.stop(1)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronPowerSaveBlocker.stop', 1)
})
