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
const ElectronNetLog = await import('../src/parts/ElectronNetLog/ElectronNetLog.js')

test('startLogging - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronNetLog.startLogging('/test.log.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test('startLogging', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return 1
  })
  expect(await ElectronNetLog.startLogging('/test.log.txt')).toBe(1)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronNetLog.startLogging', '/test.log.txt')
})

test('stopLogging - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronNetLog.stopLogging()).rejects.toThrow(new TypeError('x is not a function'))
})

test('stopLogging', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await ElectronNetLog.stopLogging()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronNetLog.stopLogging')
})
