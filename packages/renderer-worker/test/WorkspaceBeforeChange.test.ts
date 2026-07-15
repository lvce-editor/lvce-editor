import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  getPathSeparator: jest.fn(async () => '/'),
}))

jest.unstable_mockModule('../src/parts/WindowTitle/WindowTitle.js', () => ({
  set: jest.fn(async () => {}),
}))

const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

beforeEach(() => {
  GlobalEventBus.state.listenerMap = Object.create(null)
  Workspace.state.pathSeparator = '/'
  Workspace.state.workspacePath = '/old-workspace'
  Workspace.state.workspaceUri = '/old-workspace'
})

test('saves the outgoing workspace before changing to the next workspace', async () => {
  const calls: any[] = []
  GlobalEventBus.addListener('workspace.beforeChange', (oldPath, newPath) => {
    calls.push(['before', oldPath, newPath, Workspace.getWorkspacePath()])
  })
  GlobalEventBus.addListener('workspace.change', (newPath) => {
    calls.push(['after', newPath, Workspace.getWorkspacePath()])
  })

  await Workspace.setPath('/new-workspace')

  expect(calls).toEqual([
    ['before', '/old-workspace', '/new-workspace', '/old-workspace'],
    ['after', '/new-workspace', '/new-workspace'],
  ])
})
