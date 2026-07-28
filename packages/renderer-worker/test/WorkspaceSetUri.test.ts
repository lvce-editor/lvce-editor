import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/WindowTitle/WindowTitle.js', () => ({
  set: jest.fn(async () => {}),
}))

const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

beforeEach(() => {
  GlobalEventBus.state.listenerMap = Object.create(null)
  Workspace.state.pathSeparator = '/'
  Workspace.state.workspacePath = ''
  Workspace.state.workspaceUri = ''
})

test('setUri preserves the uri and decodes the workspace path', async () => {
  await Workspace.setUri('file:///home/test/my%20folder/%23project%3F')

  expect(Workspace.getWorkspacePath()).toBe('/home/test/my folder/#project?')
  expect(Workspace.getWorkspaceUri()).toBe('file:///home/test/my%20folder/%23project%3F')
})
