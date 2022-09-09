beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    powerSaveBlocker: {
      start: jest.fn(),
      stop: jest.fn(),
    },
  }
})

const electron = require('electron')
const ElectronPowerSaveBlocker = require('../src/parts/ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.js')

test('start', () => {
  // @ts-ignore
  electron.powerSaveBlocker.start.mockImplementation(() => {
    return 1
  })
  expect(ElectronPowerSaveBlocker.start('prevent-app-suspension')).toBe(1)
  expect(electron.powerSaveBlocker.start).toHaveBeenCalledTimes(1)
  expect(electron.powerSaveBlocker.start).toHaveBeenCalledWith(
    'prevent-app-suspension'
  )
})

test('start - error', () => {
  // @ts-ignore
  electron.powerSaveBlocker.start.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() =>
    ElectronPowerSaveBlocker.start('prevent-app-suspension')
  ).toThrowError(new TypeError('x is not a function'))
})

test('stop', () => {
  // @ts-ignore
  electron.powerSaveBlocker.stop.mockImplementation(() => {})
  ElectronPowerSaveBlocker.stop(1)
  expect(electron.powerSaveBlocker.stop).toHaveBeenCalledTimes(1)
  expect(electron.powerSaveBlocker.stop).toHaveBeenCalledWith(1)
})

test('stop - error', () => {
  // @ts-ignore
  electron.powerSaveBlocker.stop.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => ElectronPowerSaveBlocker.stop(1)).toThrowError(
    new TypeError('x is not a function')
  )
})
