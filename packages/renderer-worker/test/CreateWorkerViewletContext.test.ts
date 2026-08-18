import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (method: string) => {
  if (method === 'Explorer.diff2' || method === 'Explorer.render2') {
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
