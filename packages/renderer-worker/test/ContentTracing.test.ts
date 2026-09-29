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
jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(),
  }
})

const ContentTracing = await import('../src/parts/ContentTracing/ContentTracing.js')
const ElectronContentTracing = await import('../src/parts/ElectronContentTracing/ElectronContentTracing.js')
const Command = await import('../src/parts/Command/Command.js')

test('start', async () => {
  // @ts-ignore
  ElectronContentTracing.startRecording.mockImplementation(() => {})
  await ContentTracing.start()
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledTimes(1)
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledWith({
    included_categories: ['devtools.timeline', 'v8', 'blink.user_timing'],
  })
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledTimes(1)
  // @ts-ignore
  ElectronContentTracing.stopRecording.mockImplementation(() => '/test/records.txt')
  await ContentTracing.stop()
})

test('stop', async () => {
  await ContentTracing.start()
  // @ts-ignore
  ElectronContentTracing.stopRecording.mockImplementation(() => {
    return '/test/records.txt'
  })
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await ContentTracing.stop()
  expect(ElectronContentTracing.stopRecording).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Main.openInput', {
    editorInput: { type: 'webview', uri: 'file:///test/records.txt', providerId: 'builtin.performance-profile-view' },
    focus: true,
    args: [{ opener: 'builtin.performance-profile-view' }],
  })
})

test('repeated start keeps a single recording session', async () => {
  await ContentTracing.start()
  await ContentTracing.start()
  expect(ElectronContentTracing.startRecording).toHaveBeenCalledTimes(1)
  // @ts-ignore
  ElectronContentTracing.stopRecording.mockImplementation(() => '/test/records.txt')
  await ContentTracing.stop()
})

test('stop without a recording rejects without calling Electron', async () => {
  await expect(ContentTracing.stop()).rejects.toThrow('content tracing is not recording')
  expect(ElectronContentTracing.stopRecording).not.toHaveBeenCalled()
})
