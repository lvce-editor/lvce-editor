import { beforeEach, expect, jest, test } from '@jest/globals'

const execute = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const getRemoteHomepage = jest.fn<(remote: string, hosts?: unknown) => string>()
const create = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const getPreference = jest.fn<(key: string) => unknown>()
const invoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const executeViewletCommand = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const getInstance = jest.fn<() => { state: Record<string, unknown> } | undefined>()
const getPath = jest.fn<() => string>()
const isActive = jest.fn<() => boolean>()

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
jest.unstable_mockModule('../src/parts/GetRemoteHomepage/GetRemoteHomepage.js', () => ({ getRemoteHomepage }))
jest.unstable_mockModule('../src/parts/Notification/Notification.js', () => ({ create }))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({ get: getPreference }))
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getInstance }))
jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({ getPath }))
jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({ isActive }))

const WorkspaceOpenRemote = await import('../src/parts/WorkspaceOpenRemote/WorkspaceOpenRemote.js')

beforeEach(() => {
  jest.clearAllMocks()
  getPath.mockReturnValue('/workspace')
  isActive.mockReturnValue(false)
  getPreference.mockReturnValue({ 'github.com': 'https://github.com' })
  invoke.mockResolvedValue('git@github.com:owner/repository.git')
  getRemoteHomepage.mockReturnValue('https://github.com/owner/repository')
  getInstance.mockReturnValue(undefined)
  execute.mockResolvedValue(undefined)
  executeViewletCommand.mockResolvedValue(undefined)
  create.mockResolvedValue(undefined)
})

test('reports a missing workspace', async () => {
  getPath.mockReturnValue('')

  await WorkspaceOpenRemote.openRemote()

  expect(create).toHaveBeenCalledWith('info', 'Open a workspace folder to view its Git remote.')
  expect(invoke).not.toHaveBeenCalled()
})

test('reports an unsupported remote workspace', async () => {
  isActive.mockReturnValue(true)

  await WorkspaceOpenRemote.openRemote()

  expect(create).toHaveBeenCalledWith('error', 'Failed to open Git remote: Opening Git remotes is not yet supported for remote workspaces.')
})

test('reports errors while reading the Git remote', async () => {
  invoke.mockRejectedValue(new Error('git failed for https://user:password@example.com/owner/repository.git'))

  await WorkspaceOpenRemote.openRemote()

  expect(create).toHaveBeenCalledWith('error', 'Failed to open Git remote: git failed for https://<redacted>@example.com/owner/repository.git')
  expect(execute).not.toHaveBeenCalled()
})

test('reports errors while opening the Simple Browser', async () => {
  execute.mockRejectedValueOnce(new Error('Simple Browser unavailable'))

  await WorkspaceOpenRemote.openRemote()

  expect(create).toHaveBeenCalledWith('error', 'Failed to open Git remote: Simple Browser unavailable')
})

test('opens the remote in a new Simple Browser preview', async () => {
  await WorkspaceOpenRemote.openRemote()

  expect(execute).toHaveBeenNthCalledWith(1, 'Layout.showPreview', 'simple-browser://')
  expect(execute).toHaveBeenNthCalledWith(2, 'SimpleBrowser.openOrRevealTab', 'https://github.com/owner/repository')
  expect(create).not.toHaveBeenCalled()
})

test('opens the remote in an existing Simple Browser preview', async () => {
  getInstance.mockReturnValue({
    state: {
      secondaryPreviewVisible: true,
      secondaryPreviewViewletId: 'SimpleBrowser',
      secondaryPreviewId: 42,
    },
  })

  await WorkspaceOpenRemote.openRemote()

  expect(executeViewletCommand).toHaveBeenCalledWith(42, 'openOrRevealTab', 'https://github.com/owner/repository')
  expect(execute).not.toHaveBeenCalled()
  expect(create).not.toHaveBeenCalled()
})
