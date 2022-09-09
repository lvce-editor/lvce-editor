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

test('stop', () => {
  // @ts-ignore
  electron.powerSaveBlocker.stop.mockImplementation(() => {})
  ElectronPowerSaveBlocker.stop(1)
  expect(electron.powerSaveBlocker.stop).toHaveBeenCalledTimes(1)
  expect(electron.powerSaveBlocker.stop).toHaveBeenCalledWith(1)
})
