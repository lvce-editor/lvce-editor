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
const ElectronContentTracing = await import('../src/parts/ElectronContentTracing/ElectronContentTracing.js')

test('startRecording - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ElectronContentTracing.startRecording({
      included_categories: ['*'],
    }),
  ).rejects.toThrow(new TypeError('x is not a function'))
})

test('startRecording', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return 1
  })
  expect(
    await ElectronContentTracing.startRecording({
      included_categories: ['*'],
    }),
  ).toBe(1)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronContentTracing.startRecording', { included_categories: ['*'] })
})

test('stopRecording - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronContentTracing.stopRecording()).rejects.toThrow(new TypeError('x is not a function'))
})

test('stopRecording', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return '/test/records.txt'
  })
  expect(await ElectronContentTracing.stopRecording()).toBe('/test/records.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ElectronContentTracing.stopRecording')
})
