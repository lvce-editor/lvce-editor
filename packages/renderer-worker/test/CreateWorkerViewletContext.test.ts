import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
  if (method.endsWith('.diff2') || method.endsWith('.render2')) {
    return []
  }
  return undefined
})
const isTest = jest.fn(() => false)

jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.js', () => ({
  assetDir: 'test://assets',
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 2),
}))

jest.unstable_mockModule('../src/parts/WorkerInvokerMap/WorkerInvokerMap.js', () => ({
  getWorkerInvoker: jest.fn(() => ({ invoke, restart: jest.fn() })),
}))

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({
  getWorkspaceUri: jest.fn(() => 'file:///workspace'),
  isTest,
  state: {
    workspacePath: '/workspace',
  },
}))

const { createWorkerViewlet } = await import('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js')

test('reads test mode when the worker viewlet is initialized', async () => {
  const viewlet = createWorkerViewlet({ workerId: 'explorer' })
  isTest.mockReturnValue(true)
  const state = viewlet.create(7, 'test://explorer', 1, 2, 300, 200, undefined, 5)

  await viewlet.loadContent(state, undefined)

  expect(invoke.mock.calls[0]).toEqual(['Explorer.create', 7, 'test://explorer', 1, 2, 300, 200, null, 5, 2, 'test://assets', true])
})

test('creates text search with the workspace URI instead of the filesystem path', async () => {
  const viewlet = createWorkerViewlet({ workerId: 'textSearchView' })
  const state = viewlet.create(8, 'search://', 1, 2, 300, 200)

  await viewlet.loadContent(state, undefined)

  expect(invoke).toHaveBeenCalledWith('TextSearch.create', 8, 1, 2, 300, 200, 'file:///workspace', 'test://assets', 22, '', '', 2, false)
})

test('passes the workspace URI to Ports on load', async () => {
  const viewlet = createWorkerViewlet({ workerId: 'portsView' })
  const state = viewlet.create(9, 'ports://', 1, 2, 300, 200)
  await viewlet.loadContent(state, undefined)
  expect(invoke).toHaveBeenCalledWith('Ports.loadContent', 9, 'file:///workspace')
})
