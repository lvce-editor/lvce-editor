import { beforeEach, expect, jest, test } from '@jest/globals'

let shouldFail = false

jest.unstable_mockModule('../src/parts/RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts', () => ({
  invoke: jest.fn(async (command) => {
    if (shouldFail) {
      throw new Error('Failed to load worker')
    }
    if (command === 'RunningExtensions.diff2' || command === 'RunningExtensions.render2') {
      return []
    }
    if (command === 'RunningExtensions.getMenuEntryIds') {
      return [32]
    }
    if (command === 'RunningExtensions.getMenuEntries') {
      return [{ command: 'RunningExtensions.copyId', id: 'copy-id', label: 'Copy id (test.extension)' }]
    }
    return undefined
  }),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 2),
}))

jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.js', () => ({
  assetDir: '/test-assets',
}))

const RunningExtensionsViewWorker = await import('../src/parts/RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts')
const ViewletRunningExtensions = await import('../src/parts/ViewletRunningExtensions/ViewletRunningExtensions.ts')
const ViewletRunningExtensionsName = await import('../src/parts/ViewletRunningExtensions/ViewletRunningExtensionsName.ts')
const ViewletRunningExtensionsRenderTitle = await import('../src/parts/ViewletRunningExtensions/ViewletRunningExtensionsRenderTitle.ts')

beforeEach(() => {
  jest.clearAllMocks()
  shouldFail = false
})

test('provides the side bar name and title', () => {
  const state = ViewletRunningExtensions.create(1, 'RunningExtensions', 10, 20, 800, 600)

  expect(ViewletRunningExtensionsName.name).toBe('RunningExtensions')
  expect(ViewletRunningExtensionsRenderTitle.renderTitle.apply(state, state)).toBe('Running Extensions')
})

test('loadContent passes the platform and asset directory to the view worker', async () => {
  const state = ViewletRunningExtensions.create(1, 'running-extensions://', 10, 20, 800, 600)

  await ViewletRunningExtensions.loadContent(state)

  expect(RunningExtensionsViewWorker.invoke).toHaveBeenNthCalledWith(
    1,
    'RunningExtensions.create',
    1,
    'running-extensions://',
    10,
    20,
    800,
    600,
    2,
    '/test-assets',
  )
})

test('getMenus provides running extensions menu entries', async () => {
  const menus = await ViewletRunningExtensions.getMenus()

  expect(menus).toHaveLength(1)
  expect(menus[0].id).toBe(32)

  const entries = await menus[0].getMenuEntries(0)
  expect(entries).toEqual([{ command: 'RunningExtensions.copyId', id: 'copy-id', label: 'Copy id (test.extension)' }])
  expect(RunningExtensionsViewWorker.invoke).toHaveBeenLastCalledWith('RunningExtensions.getMenuEntries', 0)
})

test('getMenus returns an empty array when the view worker is unavailable', async () => {
  shouldFail = true

  await expect(ViewletRunningExtensions.getMenus()).resolves.toEqual([])
})
