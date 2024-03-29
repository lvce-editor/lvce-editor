import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  return {
    powerSaveBlocker: {
      start: jest.fn(),
      stop: jest.fn(),
    },
  }
})

const electron = await import('electron')
const ElectronPowerSaveBlocker = await import('../src/parts/ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.js')

test('start', () => {
  // @ts-expect-error
  electron.powerSaveBlocker.start.mockImplementation(() => {
    return 1
  })
  expect(ElectronPowerSaveBlocker.start('prevent-app-suspension')).toBe(1)
  expect(electron.powerSaveBlocker.start).toHaveBeenCalledTimes(1)
  expect(electron.powerSaveBlocker.start).toHaveBeenCalledWith('prevent-app-suspension')
})

test('start - error', () => {
  // @ts-expect-error
  electron.powerSaveBlocker.start.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => ElectronPowerSaveBlocker.start('prevent-app-suspension')).toThrow(new TypeError('x is not a function'))
})

test('stop', () => {
  // @ts-expect-error
  electron.powerSaveBlocker.stop.mockImplementation(() => {})
  ElectronPowerSaveBlocker.stop(1)
  expect(electron.powerSaveBlocker.stop).toHaveBeenCalledTimes(1)
  expect(electron.powerSaveBlocker.stop).toHaveBeenCalledWith(1)
})

test('stop - error', () => {
  // @ts-expect-error
  electron.powerSaveBlocker.stop.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => {
    ElectronPowerSaveBlocker.stop(1)
  }).toThrow(new TypeError('x is not a function'))
})
