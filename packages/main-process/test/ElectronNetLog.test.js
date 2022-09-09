beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    netLog: {
      startLogging: jest.fn(),
      stopLogging: jest.fn(),
    },
  }
})

const electron = require('electron')
const ElectronNetLog = require('../src/parts/ElectronNetLog/ElectronNetLog.js')

test('startLogging - error', async () => {
  // @ts-ignore
  electron.netLog.startLogging.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronNetLog.startLogging()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('startLogging', async () => {
  // @ts-ignore
  electron.netLog.startLogging.mockImplementation(async () => {
    return true
  })
  await ElectronNetLog.startLogging('/test/log.txt')
  expect(electron.netLog.startLogging).toHaveBeenCalledTimes(1)
  expect(electron.netLog.startLogging).toHaveBeenCalledWith('/test/log.txt')
})

test('stopLogging - error', async () => {
  // @ts-ignore
  electron.netLog.stopLogging.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronNetLog.stopLogging()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('stopLogging', async () => {
  // @ts-ignore
  electron.netLog.stopLogging.mockImplementation(() => {})
  await ElectronNetLog.stopLogging()
  expect(electron.netLog.stopLogging).toHaveBeenCalledTimes(1)
  expect(electron.netLog.stopLogging).toHaveBeenCalledWith()
})
