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
const ElectronContentTracing = await import(
  '../src/parts/ElectronContentTracing/ElectronContentTracing.js'
)

test('startRecording - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronContentTracing.startRecording()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('startRecording', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    return 1
  })
  expect(await ElectronContentTracing.startRecording()).toBe(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronContentTracing.startRecording'
  )
})

test('stopRecording - error', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronContentTracing.stopRecording()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('stopRecording', async () => {
  // @ts-ignore
  ElectronProcess.invoke.mockImplementation(() => {
    return '/test/records.txt'
  })
  expect(await ElectronContentTracing.stopRecording()).toBe('/test/records.txt')
  expect(ElectronProcess.invoke).toHaveBeenCalledTimes(1)
  expect(ElectronProcess.invoke).toHaveBeenCalledWith(
    'ElectronContentTracing.stopRecording'
  )
})
