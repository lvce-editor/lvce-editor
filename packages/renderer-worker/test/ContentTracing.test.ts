import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ElectronContentTracing/ElectronContentTracing.js', () => {
  return {
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: PlatformType.Electron,
    getPlatform: () => {
      return PlatformType.Electron
    },
  }
})
jest.unstable_mockModule('../src/parts/OpenUri/OpenUri.js', () => {
  return {
    openUri: jest.fn(),
  }
})

const ContentTracing = await import('../src/parts/ContentTracing/ContentTracing.js')
const ElectronContentTracing = await import('../src/parts/ElectronContentTracing/ElectronContentTracing.js')
const OpenUri = await import('../src/parts/OpenUri/OpenUri.js')

test('start', async () => {
  // @ts-ignore
  ElectronContentTracing.startRecording.mockImplementation(() => {})
  await ContentTracing.start()
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledTimes(1)
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledWith({
    included_categories: ['*'],
  })
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledTimes(1)
  await ContentTracing.stop()
})

test('stop', async () => {
  await ContentTracing.start()
  // @ts-ignore
  ElectronContentTracing.stopRecording.mockImplementation(() => {
    return '/test/records.txt'
  })
  // @ts-ignore
  OpenUri.openUri.mockImplementation(() => {})
  await ContentTracing.stop()
  expect(ElectronContentTracing.stopRecording).toHaveBeenCalledTimes(1)
  expect(OpenUri.openUri).toHaveBeenCalledTimes(1)
  expect(OpenUri.openUri).toHaveBeenCalledWith('/test/records.txt', true, { opener: 'builtin.performance-profile-view' })
})

test('repeated start keeps a single recording session', async () => {
  await ContentTracing.start()
  await ContentTracing.start()
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledTimes(1)
  await ContentTracing.stop()
})

test('stop without a recording rejects without calling Electron', async () => {
  await expect(ContentTracing.stop()).rejects.toThrow('content tracing is not recording')
  expect(ElectronContentTracing.stopRecording).not.toHaveBeenCalled()
})
