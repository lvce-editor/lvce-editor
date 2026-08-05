import { beforeEach, expect, jest, test } from '@jest/globals'

const getPathSeparator = jest.fn<(uri: string) => Promise<string>>(async () => '/')
const setWindowTitle = jest.fn<(title: string) => Promise<void>>(async () => {})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  getPathSeparator,
}))

jest.unstable_mockModule('../src/parts/WindowTitle/WindowTitle.js', () => ({
  set: setWindowTitle,
}))

jest.unstable_mockModule('../src/parts/Product/Product.js', () => ({
  getProductNameLong: () => 'Lvce Editor',
}))

const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

beforeEach(() => {
  getPathSeparator.mockClear()
  setWindowTitle.mockClear()
  GlobalEventBus.state.listenerMap = Object.create(null)
  Workspace.state.pathSeparator = '/'
  Workspace.state.workspacePath = ''
  Workspace.state.workspaceUri = ''
})

test('setPath uses the product name for an empty workspace', async () => {
  await Workspace.setPath('')

  expect(setWindowTitle).toHaveBeenCalledWith('Lvce Editor')
})

test('setPath uses the folder name for a workspace', async () => {
  await Workspace.setPath('/home/test/project')

  expect(setWindowTitle).toHaveBeenCalledWith('project')
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

test('setUri uses a provided provider path separator', async () => {
  await Workspace.setUri('remote-ssh:///test-folder', '\\')

  expect(Workspace.getWorkspacePath()).toBe('remote-ssh:///test-folder')
  expect(Workspace.getWorkspaceUri()).toBe('remote-ssh:///test-folder')
  expect(Workspace.state.pathSeparator).toBe('\\')
  expect(getPathSeparator).not.toHaveBeenCalled()
})
