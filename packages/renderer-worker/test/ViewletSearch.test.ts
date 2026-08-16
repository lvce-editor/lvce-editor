import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.js', () => ({
  assetDir: '/test-assets',
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 2),
}))

jest.unstable_mockModule('../src/parts/TextSearchViewWorker/TextSearchViewWorker.js', () => ({
  invoke: jest.fn(async (command) => {
    if (command === 'TextSearch.renderActions') {
      return []
    }
    return []
  }),
  restart: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({
  state: {
    workspacePath: '/test-workspace',
  },
}))

const TextSearchViewWorker = await import('../src/parts/TextSearchViewWorker/TextSearchViewWorker.js')
const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.ipc.ts')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

beforeEach(() => {
  jest.clearAllMocks()
  Workspace.state.workspacePath = '/test-workspace'
})

test('loadContent uses the current workspace path', async () => {
  const state = ViewletSearch.create(1, 'Search', 10, 20, 800, 600)
  Workspace.state.workspacePath = '/new-workspace'

  await ViewletSearch.loadContent(state, {})

  expect(TextSearchViewWorker.invoke).toHaveBeenNthCalledWith(
    1,
    'TextSearch.create',
    1,
    10,
    20,
    800,
    600,
    '/new-workspace',
    '/test-assets',
    22,
    '',
    '',
    2,
    false,
  )
})

test('create identifies sidebar search', () => {
  const state = ViewletSearch.create(1, 'Search', 10, 20, 800, 600)

  expect(state.isSearchEditor).toBe(false)
  expect(state.uri).toBe('Search')
  expect(ViewletSearch.getStorageKey(state)).toBe('Search')
})

test('create identifies search editors', () => {
  const state = ViewletSearch.create(1, 'search-editor://1/Search', 10, 20, 800, 600)

  expect(state.isSearchEditor).toBe(true)
  expect(state.uri).toBe('search-editor://1/Search')
  expect(ViewletSearch.getStorageKey(state)).toBe('search-editor://1/Search')
})

test('loadContent passes search editor mode to the text search view', async () => {
  const state = ViewletSearch.create(1, 'search-editor://1/Search', 10, 20, 800, 600)

  await ViewletSearch.loadContent(state, {})

  expect(TextSearchViewWorker.invoke).toHaveBeenNthCalledWith(
    1,
    'TextSearch.create',
    1,
    10,
    20,
    800,
    600,
    '/test-workspace',
    '/test-assets',
    22,
    '',
    '',
    2,
    true,
  )
})
