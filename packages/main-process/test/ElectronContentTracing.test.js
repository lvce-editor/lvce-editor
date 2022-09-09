beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    contentTracing: {
      stopRecording: jest.fn(),
      startRecording: jest.fn(),
      decryptString: jest.fn(),
    },
  }
})

const electron = require('electron')
const ElectronContentTracing = require('../src/parts/ElectronContentTracing/ElectronContentTracing.js')

test('startRecording - error', async () => {
  // @ts-ignore
  electron.contentTracing.startRecording.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(() =>
    ElectronContentTracing.startRecording({
      included_categories: ['*'],
    })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('startRecording', async () => {
  // @ts-ignore
  electron.contentTracing.startRecording.mockImplementation(() => {
    return 'encrypted'
  })
  await ElectronContentTracing.startRecording({
    included_categories: ['*'],
  })
  expect(electron.contentTracing.startRecording).toHaveBeenCalledTimes(1)
  expect(electron.contentTracing.startRecording).toHaveBeenCalledWith({
    included_categories: ['*'],
  })
})

test('stopRecording - error', async () => {
  // @ts-ignore
  electron.contentTracing.stopRecording.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ElectronContentTracing.stopRecording()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('stopRecording', async () => {
  // @ts-ignore
  electron.contentTracing.stopRecording.mockImplementation(() => {
    return '/test/records.txt'
  })
  expect(await ElectronContentTracing.stopRecording()).toBe('/test/records.txt')
  expect(electron.contentTracing.stopRecording).toHaveBeenCalledTimes(1)
})
