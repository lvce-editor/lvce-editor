import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  return {
    netLog: {
      startLogging: jest.fn(),
      stopLogging: jest.fn(),
    },
  }
})

const electron = await import('electron')
const ElectronNetLog = await import('../src/parts/ElectronNetLog/ElectronNetLog.js')

test('startLogging - error', async () => {
  // @ts-expect-error
  electron.netLog.startLogging.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronNetLog.startLogging()).rejects.toThrow(new TypeError('x is not a function'))
})

test('startLogging', async () => {
  // @ts-expect-error
  electron.netLog.startLogging.mockImplementation(async () => {
    return true
  })
  await ElectronNetLog.startLogging('/test/log.txt')
  expect(electron.netLog.startLogging).toHaveBeenCalledTimes(1)
  expect(electron.netLog.startLogging).toHaveBeenCalledWith('/test/log.txt')
})

test('stopLogging - error', async () => {
  // @ts-expect-error
  electron.netLog.stopLogging.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronNetLog.stopLogging()).rejects.toThrow(new TypeError('x is not a function'))
})

test('stopLogging', async () => {
  // @ts-expect-error
  electron.netLog.stopLogging.mockImplementation(() => {})
  await ElectronNetLog.stopLogging()
  expect(electron.netLog.stopLogging).toHaveBeenCalledTimes(1)
  expect(electron.netLog.stopLogging).toHaveBeenCalledWith()
})
