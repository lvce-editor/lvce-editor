import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => PlatformType.Web),
}))

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => ({
  invoke: jest.fn(async (command: string) => {
    if (command === 'ActivityBar.diff2') {
      return []
    }
    if (command === 'ActivityBar.render2') {
      return []
    }
    return undefined
  }),
  restart: jest.fn(),
}))

const ActivityBarWorker = await import('../src/parts/ActivityBarWorker/ActivityBarWorker.js')
const ViewletActivityBar = await import('../src/parts/ViewletActivityBar/ViewletActivityBar.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('loadContent passes the web platform to the activity bar worker', async () => {
  const state = ViewletActivityBar.create(1, '', 2, 3, 48, 600)

  await ViewletActivityBar.loadContent(state)

  expect(ActivityBarWorker.invoke).toHaveBeenNthCalledWith(1, 'ActivityBar.create', 1, '', 2, 3, 48, 600, null, null, PlatformType.Web)
})

test('hotReload preserves the web platform when recreating the activity bar', async () => {
  const state = {
    ...ViewletActivityBar.create(1, '', 2, 3, 48, 600),
    isHotReloading: false,
  }

  await ViewletActivityBar.hotReload(state)

  expect(ActivityBarWorker.invoke).toHaveBeenNthCalledWith(2, 'ActivityBar.create', 1, '', 2, 3, 48, 600, null, null, PlatformType.Web)
})
