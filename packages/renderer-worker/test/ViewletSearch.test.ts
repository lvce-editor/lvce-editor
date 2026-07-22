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
const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('create identifies sidebar search', () => {
  const state = ViewletSearch.create(1, 'Search', 10, 20, 800, 600)

  expect(state.isSearchEditor).toBe(false)
})

test('create identifies search editors', () => {
  const state = ViewletSearch.create(1, 'search-editor://1/Search', 10, 20, 800, 600)

  expect(state.isSearchEditor).toBe(true)
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
