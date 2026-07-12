import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts', () => ({
  invoke: jest.fn(async (command) => {
    if (command === 'RunningExtensions.diff2' || command === 'RunningExtensions.render2') {
      return []
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

beforeEach(() => {
  jest.clearAllMocks()
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
