import { beforeEach, expect, jest, test } from '@jest/globals'

const getPathSeparator = jest.fn<(uri: string) => Promise<string>>(async () => '/')

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  getPathSeparator,
}))

jest.unstable_mockModule('../src/parts/WindowTitle/WindowTitle.js', () => ({
  set: jest.fn(async () => {}),
}))

const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

beforeEach(() => {
  getPathSeparator.mockClear()
  GlobalEventBus.state.listenerMap = Object.create(null)
  Workspace.state.pathSeparator = '/'
  Workspace.state.workspacePath = ''
  Workspace.state.workspaceUri = ''
})

test('setUri preserves the uri and decodes the workspace path', async () => {
  await Workspace.setUri('file:///home/test/my%20folder/%23project%3F')

  expect(Workspace.getWorkspacePath()).toBe('/home/test/my folder/#project?')
  expect(Workspace.getWorkspaceUri()).toBe('file:///home/test/my%20folder/%23project%3F')
  expect(Workspace.state.pathSeparator).toBe('/')
  expect(getPathSeparator).toHaveBeenCalledWith('file:///home/test/my%20folder/%23project%3F')
})

test('setUri preserves a custom uri as the workspace path', async () => {
  getPathSeparator.mockResolvedValue('\\')

  await Workspace.setUri('remote-ssh:///test-folder')

  expect(Workspace.getWorkspacePath()).toBe('remote-ssh:///test-folder')
  expect(Workspace.getWorkspaceUri()).toBe('remote-ssh:///test-folder')
  expect(Workspace.state.pathSeparator).toBe('\\')
  expect(getPathSeparator).toHaveBeenCalledWith('remote-ssh:///test-folder')
})
