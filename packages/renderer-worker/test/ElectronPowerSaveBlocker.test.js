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
const ElectronPowerSaveBlocker = await import(
  '../src/parts/ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.js'
)

test('start - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ElectronPowerSaveBlocker.start('prevent-app-suspension')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('start', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    return 1
  })
  expect(await ElectronPowerSaveBlocker.start('prevent-app-suspension')).toBe(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronPowerSaveBlocker.start',
    'prevent-app-suspension'
  )
})

test('stop - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronPowerSaveBlocker.stop(1)).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('stop', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  await ElectronPowerSaveBlocker.stop(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronPowerSaveBlocker.stop',
    1
  )
})
