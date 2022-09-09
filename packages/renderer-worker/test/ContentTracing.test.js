import { jest } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ElectronContentTracing/ElectronContentTracing.js',
  () => {
    return {
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
    }
  }
)
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: PlatformType.Electron,
  }
})
jest.unstable_mockModule('../src/parts/Open/Open.js', () => {
  return {
    openNativeFolder: jest.fn(),
  }
})

const ContentTracing = await import(
  '../src/parts/ContentTracing/ContentTracing.js'
)
const ElectronContentTracing = await import(
  '../src/parts/ElectronContentTracing/ElectronContentTracing.js'
)
const Open = await import('../src/parts/Open/Open.js')

test('start', async () => {
  // @ts-ignore
  ElectronContentTracing.startRecording.mockImplementation(() => {})
  await ContentTracing.start()
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledTimes(1)
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledWith({
    included_categories: ['*'],
  })
})

test('stop', async () => {
  // @ts-ignore
  ElectronContentTracing.stopRecording.mockImplementation(() => {
    return '/test/records.txt'
  })
  // @ts-ignore
  Open.openNativeFolder.mockImplementation(() => {})
  await ContentTracing.stop()
  expect(ElectronContentTracing.stopRecording).toHaveBeenCalledTimes(1)
  expect(Open.openNativeFolder).toHaveBeenCalledTimes(1)
  expect(Open.openNativeFolder).toHaveBeenCalledWith('/test/records.txt')
})
