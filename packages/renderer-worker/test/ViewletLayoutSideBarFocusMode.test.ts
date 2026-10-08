import { expect, jest, test } from '@jest/globals'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'
import { getLayoutVirtualDom } from '../src/parts/GetLayoutVirtualDom/GetLayoutVirtualDom.ts'

const activityBarInvoke = jest.fn<(...args: unknown[]) => Promise<unknown[]>>(async () => [])
const commandExecute = jest.fn(async (..._args: readonly unknown[]) => undefined)
jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => ({ invoke: activityBarInvoke }))
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: commandExecute }))
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

test('enterSideBarFocusMode gives the secondary side bar the full content area', async () => {
  const state = createState()
  const result = await ViewletLayout.enterSideBarFocusMode(state, 'secondary')

  expect(result.newState).toEqual(
    expect.objectContaining({
      activityBarVisible: false,
      mainVisible: false,
      panelVisible: false,
      previewVisible: false,
      secondarySideBarHeight: state.windowHeight - state.titleBarHeight - state.statusBarHeight,
      secondarySideBarLeft: 0,
      secondarySideBarTop: state.titleBarHeight,
      secondarySideBarVisible: true,
      secondarySideBarWidth: 1200,
      sideBarFocusMode: true,
      sideBarFocusModeTarget: 'secondary',
      sideBarVisible: false,
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

test('toggleSideBar toggles Chat 2 sessions in AI-native layout', async () => {
  const state = createState()
  const aiNativeState = { ...state, aiNativeLayout: true, sideBarFocusMode: true }

  const result = await ViewletLayout.toggleSideBar(aiNativeState)

  expect(commandExecute).toHaveBeenCalledWith('ExtensionHost.executeCommand', 'chat2.toggleSessionsList')
  expect(result).toEqual({ newState: aiNativeState, commands: [] })
})

test('leaveSideBarFocusMode restores the secondary side bar width', async () => {
  const state = createState()
  const focused = await ViewletLayout.enterSideBarFocusMode(state, 'secondary')
  const restored = await ViewletLayout.leaveSideBarFocusMode(focused.newState)

  expect(restored.newState).toEqual(
    expect.objectContaining({
      secondarySideBarVisible: true,
      secondarySideBarWidth: state.secondarySideBarWidth,
      sideBarFocusMode: false,
      sideBarFocusModeLayout: undefined,
      sideBarFocusModeTarget: 'primary',
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

test('secondary side bar focus mode follows window resizes', async () => {
  const focused = await ViewletLayout.enterSideBarFocusMode(createState(), 'secondary')
  const resized = await ViewletLayout.handleResize(focused.newState, 900, 600)

  expect(resized.newState.secondarySideBarWidth).toBe(900)
  expect(resized.newState.secondarySideBarHeight).toBe(600 - resized.newState.titleBarHeight - resized.newState.statusBarHeight)
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

test('saveState preserves the normal secondary side bar width while focused', async () => {
  const state = createState()
  const focused = await ViewletLayout.enterSideBarFocusMode(state, 'secondary')

  expect(ViewletLayout.saveState(focused.newState)).toEqual(
    expect.objectContaining({
      secondarySideBarVisible: true,
      secondarySideBarWidth: state.secondarySideBarWidth,
      sideBarVisible: true,
      sideBarWidth: state.sideBarWidth,
    }),
  )
})

test('AI-native layout is restored while keeping the IDE layout available to return to', async () => {
  const state = createState()
  const focused = await ViewletLayout.enterSideBarFocusMode(state, 'primary', true)
  const saved = ViewletLayout.saveState(focused.newState)
  const restored = ViewletLayout.loadContent(ViewletLayout.create(2), {
    ...saved,
    Layout: { bounds: { windowWidth: state.windowWidth, windowHeight: state.windowHeight } },
  })

  expect(saved.aiNativeLayout).toBe(true)
  expect(restored).toEqual(
    expect.objectContaining({
      aiNativeLayout: true,
      sideBarFocusMode: true,
      sideBarFocusModeTarget: 'primary',
      sideBarFocusModeLayout: expect.objectContaining({
        activityBarVisible: true,
        mainVisible: true,
        panelVisible: true,
        sideBarVisible: true,
        sideBarWidth: state.sideBarWidth,
      }),
      sideBarWidth: state.windowWidth - 48,
      titleBarVisible: false,
      statusBarVisible: false,
    }),
  )

  const returnedToIde = await ViewletLayout.leaveSideBarFocusMode(restored)
  expect(returnedToIde.newState).toEqual(
    expect.objectContaining({
      aiNativeLayout: false,
      sideBarFocusMode: false,
      sideBarWidth: state.sideBarWidth,
      mainVisible: true,
      panelVisible: true,
      sideBarVisible: true,
    }),
  )
})

test.each([
  ['older saved state', {}],
  ['restore false', { aiNativeLayout: true, restore: false }],
])('%s does not restore AI-native layout', (_name, savedState) => {
  const state = createState()
  const restored = ViewletLayout.loadContent(ViewletLayout.create(2), {
    ...savedState,
    Layout: { bounds: { windowWidth: state.windowWidth, windowHeight: state.windowHeight } },
  })

  expect(restored.aiNativeLayout).toBeFalsy()
  expect(restored).toEqual(
    expect.objectContaining({
      sideBarFocusMode: false,
      mainVisible: true,
      titleBarVisible: true,
      statusBarVisible: true,
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

test('enterSideBarFocusMode is a no-op when the secondary side bar is hidden', async () => {
  const state = {
    ...createState(),
    secondarySideBarVisible: false,
  }

  expect(await ViewletLayout.enterSideBarFocusMode(state, 'secondary')).toEqual({
    newState: state,
    commands: [],
  })
})

test.each([SideBarLocationType.Left, SideBarLocationType.Right])(
  'AI-native layout preserves sidebar location %s and restores IDE bounds after resizing',
  async (sideBarLocation) => {
    const state = LayoutPoints.getPoints({ ...createState(), sideBarLocation })
    const result = await ViewletLayout.enterSideBarFocusMode(state, 'primary', true)
    expect(result.newState).toEqual(
      expect.objectContaining({
        aiNativeLayout: true,
        activityBarVisible: true,
        sideBarLocation,
        activityBarLeft: sideBarLocation === SideBarLocationType.Right ? 1152 : 0,
        activityBarWidth: 48,
        sideBarLeft: sideBarLocation === SideBarLocationType.Right ? 0 : 48,
        sideBarWidth: 1152,
        sideBarTop: 0,
        sideBarHeight: 800,
        titleBarVisible: false,
        statusBarVisible: false,
      }),
    )
    expect(getLayoutVirtualDom(result.newState)[0].className.includes('AiNativeLayoutRight')).toBe(sideBarLocation === SideBarLocationType.Right)
    const resized = LayoutPoints.getPoints({ ...result.newState, windowWidth: 900, windowHeight: 600 })
    expect(resized.sideBarWidth).toBe(852)
    expect(resized.activityBarLeft).toBe(sideBarLocation === SideBarLocationType.Right ? 852 : 0)
    const restored = await ViewletLayout.leaveSideBarFocusMode(resized)
    expect(restored.newState).toEqual(
      expect.objectContaining({
        aiNativeLayout: false,
        sideBarWidth: state.sideBarWidth,
        sideBarLocation: state.sideBarLocation,
        titleBarVisible: true,
        statusBarVisible: true,
        windowWidth: 900,
        windowHeight: 600,
      }),
    )
  },
)

test('AI-native layout restricts the existing activity bar and restores it on exit', async () => {
  activityBarInvoke.mockClear()
  const state = { ...createState(), activityBarId: 42 }

  const focused = await ViewletLayout.enterSideBarFocusMode(state, 'primary', true)
  expect(activityBarInvoke).toHaveBeenCalledWith('ActivityBar.setAiNativeLayout', 42, true)
  expect(activityBarInvoke).toHaveBeenCalledWith('ActivityBar.diff2', 42)
  expect(activityBarInvoke).toHaveBeenCalledWith('ActivityBar.render2', 42, [])

  activityBarInvoke.mockClear()
  await ViewletLayout.leaveSideBarFocusMode(focused.newState)
  expect(activityBarInvoke).toHaveBeenCalledWith('ActivityBar.setAiNativeLayout', 42, false)
})
