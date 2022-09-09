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
const ElectronNetLog = await import(
  '../src/parts/ElectronNetLog/ElectronNetLog.js'
)

test('startLogging - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ElectronNetLog.startLogging('/test.log.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('startLogging', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    return 1
  })
  expect(await ElectronNetLog.startLogging('/test.log.txt')).toBe(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronNetLog.startLogging',
    '/test.log.txt'
  )
})

test('stopLogging - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronNetLog.stopLogging()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('stopLogging', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {})
  await ElectronNetLog.stopLogging()
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronNetLog.stopLogging'
  )
})
