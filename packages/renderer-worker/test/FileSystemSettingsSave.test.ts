import { beforeEach, expect, jest, test } from '@jest/globals'
import { setImmediate } from 'node:timers/promises'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

const execute = jest.fn()
const emitEvent = jest.fn()
const writeFile = jest.fn()

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
jest.unstable_mockModule('../src/parts/GlobalEventBus/GlobalEventBus.js', () => ({ emitEvent }))
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({ getPlatform: () => PlatformType.Remote }))
jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getUserSettingsPath: async () => 'test:///profile/settings.json',
}))

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const FileSystemApp = await import('../src/parts/FileSystem/FileSystemApp.js')
const FileSystemState = await import('../src/parts/FileSystemState/FileSystemState.js')

FileSystemState.registerAll({
  app: () => FileSystemApp,
  test: () => ({ writeFile }),
})

beforeEach(() => {
  jest.resetAllMocks()
})

test('settings editor save completes while source control refresh is still pending', async () => {
  const refresh = Promise.withResolvers<void>()
  execute.mockImplementation(() => refresh.promise)
  let saved = false
  const saving = FileSystem.writeFile('app:///settings.json', '{"editor.lineNumbers":true}', 'utf8', false).then(() => {
    saved = true
  })
  try {
    // Drain the asynchronous app URI resolution and nested file write without
    // allowing a slow Git refresh to complete the editor's save command.
    await setImmediate()
    expect(writeFile).toHaveBeenCalledWith('test:///profile/settings.json', '{"editor.lineNumbers":true}', 'utf8')
    expect(saved).toBe(true)
    expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
    expect(execute).not.toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', expect.anything())
    expect(emitEvent).toHaveBeenCalledWith('fileSystem.changed', { changed: ['app:///settings.json'] })
  } finally {
    refresh.resolve()
    await saving
  }
})
