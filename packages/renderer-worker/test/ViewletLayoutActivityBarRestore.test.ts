import { expect, jest, test } from '@jest/globals'

const activityBarInvoke = jest.fn<(...args: unknown[]) => Promise<unknown[]>>(async (command: unknown) => {
  if (command === 'ActivityBar.render2') {
    return [['ActivityBar.rendered']]
  }
  return []
})
const viewletLoad = jest.fn<(...args: unknown[]) => Promise<any[]>>(async () => [['Viewlet.loaded']])
let savedState: any

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => ({ invoke: activityBarInvoke }))
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ load: viewletLoad }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getInstance: () => undefined,
  getState: () => savedState,
}))

const LayoutPoints = await import('../src/parts/ViewletLayout/LayoutPoints.ts')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

const createState = (aiNativeLayout: boolean) => {
  return LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    activityBarSashVisible: true,
    activityBarVisible: true,
    mainVisible: true,
    panelVisible: true,
    sideBarVisible: true,
    statusBarVisible: !aiNativeLayout,
    titleBarVisible: !aiNativeLayout,
    windowHeight: 800,
    windowWidth: 1200,
    aiNativeLayout,
  })
}

test('restored AI-native layout filters the activity bar after loading it', async () => {
  const original = createState(false)
  const focused = await ViewletLayout.enterSideBarFocusMode(original, 'primary', true)
  const restoredState = ViewletLayout.loadContent(ViewletLayout.create(2), {
    ...ViewletLayout.saveState(focused.newState),
    Layout: { bounds: { windowWidth: original.windowWidth, windowHeight: original.windowHeight } },
  })
  savedState = restoredState
  activityBarInvoke.mockClear()
  viewletLoad.mockClear()

  const restored = await ViewletLayout.loadActivityBarIfVisible(restoredState)

  expect(viewletLoad).toHaveBeenCalledTimes(1)
  expect(restored.newState.activityBarId).not.toBe(-1)
  expect(activityBarInvoke.mock.calls).toEqual([
    ['ActivityBar.setAiNativeLayout', restored.newState.activityBarId, true],
    ['ActivityBar.diff2', restored.newState.activityBarId],
    ['ActivityBar.render2', restored.newState.activityBarId, []],
  ])
  expect(restored.commands).toEqual([['Viewlet.loaded'], ['ActivityBar.rendered']])
})

test('IDE layout loads the activity bar without applying AI-native filtering', async () => {
  const state = createState(false)
  savedState = state
  activityBarInvoke.mockClear()

  await ViewletLayout.loadActivityBarIfVisible(state)

  expect(activityBarInvoke).not.toHaveBeenCalled()
})
