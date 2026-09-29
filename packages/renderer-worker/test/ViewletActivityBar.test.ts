import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => PlatformType.Web),
}))

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => ({
  invoke: jest.fn(async (command: string) => {
    if (command === 'ActivityBar.getComponentState') {
      return { uid: 1, selectedIndex: 0 }
    }
    if (command === 'ActivityBar.getComponentDom') {
      return [{ id: 'ActivityBar', type: 4 }]
    }
    if (command === 'ActivityBar.setComponentState') {
      return undefined
    }
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

test('gets and sets live component state through the activity bar worker', async () => {
  const state = ViewletActivityBar.create(1, '', 2, 3, 48, 600)
  const componentState = { uid: 1, selectedIndex: 0 }

  await expect(ViewletActivityBar.getComponentState!(state)).resolves.toEqual(componentState)
  await ViewletActivityBar.setComponentState!(state, componentState)

  expect(ActivityBarWorker.invoke).toHaveBeenNthCalledWith(1, 'ActivityBar.getComponentState', 1)
  expect(ActivityBarWorker.invoke).toHaveBeenNthCalledWith(2, 'ActivityBar.setComponentState', 1, componentState)
})

test('gets live component DOM through the activity bar worker', async () => {
  const state = ViewletActivityBar.create(1, '', 2, 3, 48, 600)
  const componentDom = [{ id: 'ActivityBar', type: 4 }]

  await expect(ViewletActivityBar.getComponentDom!(state)).resolves.toEqual(componentDom)

  expect(ActivityBarWorker.invoke).toHaveBeenCalledWith('ActivityBar.getComponentDom', 1)
})
