import { expect, test } from '@jest/globals'

const LayoutPoints = await import('../src/parts/ViewletLayout/LayoutPoints.ts')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

const createState = () => {
  return LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    activityBarSashVisible: true,
    activityBarVisible: true,
    activityBarWidth: 48,
    mainVisible: true,
    panelHeight: 180,
    panelMaxHeight: 600,
    panelMinHeight: 150,
    panelSashVisible: true,
    panelVisible: true,
    previewMinWidth: 100,
    previewSashVisible: true,
    previewVisible: true,
    previewWidth: 300,
    secondarySideBarMinWidth: 220,
    secondarySideBarVisible: true,
    secondarySideBarWidth: 260,
    sideBarMaxWidth: 9_999_999,
    sideBarMinWidth: 170,
    sideBarSashVisible: true,
    sideBarVisible: true,
    sideBarWidth: 280,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  })
}

test('enterSideBarFocusMode gives the side bar the full content area', async () => {
  const state = createState()
  const result = await ViewletLayout.enterSideBarFocusMode(state)

  expect(result.newState).toEqual(
    expect.objectContaining({
      activityBarVisible: false,
      mainVisible: false,
      panelVisible: false,
      previewVisible: false,
      secondarySideBarVisible: false,
      sideBarFocusMode: true,
      sideBarHeight: state.windowHeight - state.titleBarHeight - state.statusBarHeight,
      sideBarLeft: 0,
      sideBarSashVisible: false,
      sideBarTop: state.titleBarHeight,
      sideBarVisible: true,
      sideBarWidth: 1200,
    }),
  )
})

test('leaveSideBarFocusMode restores the previous layout', async () => {
  const state = createState()
  const focused = await ViewletLayout.enterSideBarFocusMode(state)
  const restored = await ViewletLayout.leaveSideBarFocusMode(focused.newState)

  expect(restored.newState).toEqual(
    expect.objectContaining({
      activityBarVisible: true,
      mainVisible: true,
      panelVisible: true,
      previewVisible: true,
      secondarySideBarVisible: true,
      sideBarFocusMode: false,
      sideBarFocusModeLayout: undefined,
      sideBarSashVisible: true,
      sideBarVisible: true,
      sideBarWidth: state.sideBarWidth,
    }),
  )
})

test('focus mode follows window resizes', async () => {
  const focused = await ViewletLayout.enterSideBarFocusMode(createState())
  const resized = await ViewletLayout.handleResize(focused.newState, 900, 600)

  expect(resized.newState.sideBarWidth).toBe(900)
  expect(resized.newState.sideBarHeight).toBe(600 - resized.newState.titleBarHeight - resized.newState.statusBarHeight)
})

test('saveState preserves the normal side bar width while focused', async () => {
  const state = createState()
  const focused = await ViewletLayout.enterSideBarFocusMode(state)

  expect(ViewletLayout.saveState(focused.newState)).toEqual(
    expect.objectContaining({
      activityBarVisible: true,
      panelVisible: true,
      previewVisible: true,
      secondarySideBarVisible: true,
      sideBarWidth: state.sideBarWidth,
    }),
  )
})

test('hidden layout visibility commands are no-ops while focus mode is active', async () => {
  const focused = await ViewletLayout.enterSideBarFocusMode(createState())

  expect(await ViewletLayout.hidePanel(focused.newState)).toEqual({
    newState: focused.newState,
    commands: [],
  })
  expect(await ViewletLayout.showActivityBar(focused.newState)).toEqual({
    newState: focused.newState,
    commands: [],
  })
})

test('enterSideBarFocusMode is a no-op when the side bar is hidden', async () => {
  const state = {
    ...createState(),
    sideBarVisible: false,
  }

  expect(await ViewletLayout.enterSideBarFocusMode(state)).toEqual({
    newState: state,
    commands: [],
  })
})
