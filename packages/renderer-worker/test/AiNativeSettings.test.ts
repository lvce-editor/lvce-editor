import { beforeEach, expect, jest, test } from '@jest/globals'
import type { LayoutState } from '../src/parts/ViewletLayout/LayoutState.ts'

const load = jest.fn(async (..._args: any[]) => [['Viewlet.create', 'Settings', 42]])
const resize = jest.fn(async (..._args: any[]) => [])
const disposeFunctional = jest.fn((_uid: number) => [['Viewlet.dispose', 42]])
const getResizeCommands = jest.fn(async (..._args: any[]) => [])
const openUri = jest.fn(async (_uri: string) => undefined)
jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({ create: () => 42 }))
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ load }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ resize, disposeFunctional }))
jest.unstable_mockModule('../src/parts/ViewletLayout/ViewletLayout.ts', () => ({ getResizeCommands }))
jest.unstable_mockModule('../src/parts/OpenUri/OpenUri.js', () => ({ openUri }))
const Settings = await import('../src/parts/AiNativeLayout/AiNativeLayout.ts')
const { getPoints } = await import('../src/parts/ViewletLayout/LayoutPoints.ts')
const { getLayoutVirtualDom } = await import('../src/parts/GetLayoutVirtualDom/GetLayoutVirtualDom.ts')

const createState = (sideBarLocation = 2, target: 'primary' | 'secondary' = 'primary'): LayoutState =>
  getPoints({
    sideBarWidth: 280,
    sideBarMinWidth: 100,
    sideBarMaxWidth: 10000,
    secondarySideBarWidth: 280,
    secondarySideBarMinWidth: 100,
    secondarySideBarMaxWidth: 10000,
    panelHeight: 200,
    panelMinHeight: 100,
    panelMaxHeight: 600,
    titleBarHeight: 35,
    statusBarHeight: 20,
    previewWidth: 0,
    secondaryPreviewWidth: 0,
    previewMinWidth: 100,
    secondaryPreviewMinWidth: 100,
    mountedViewletsBySource: {},
    widgetReferences: [],
    uid: 1,
    windowWidth: 1200,
    windowHeight: 800,
    aiNativeLayout: true,
    sideBarFocusMode: true,
    sideBarFocusModeTarget: target,
    sideBarLocation,
    activityBarVisible: true,
    sideBarId: 2,
    secondarySideBarId: 3,
    titleBarVisible: false,
    statusBarVisible: false,
  } as unknown as LayoutState)

beforeEach(() => {
  jest.clearAllMocks()
})

test('IDE settings open in the normal main area', async () => {
  const state = { ...createState(), aiNativeLayout: false }
  expect(await Settings.openSettings(state)).toEqual({ newState: state, commands: [] })
  expect(openUri).toHaveBeenCalledWith('app:///settings.json')
  expect(load).not.toHaveBeenCalled()
})

test.each([
  [1, 'primary'],
  [2, 'primary'],
  [1, 'secondary'],
  [2, 'secondary'],
] as const)('settings preserve AI layout and the %s %s sidebar', async (side, target) => {
  const state = createState(side, target)
  const { newState } = await Settings.openSettings(state)
  expect(newState.aiNativeLayout).toBe(true)
  expect(newState.sideBarId).toBe(2)
  expect(target === 'primary' ? newState.sideBarWidth : newState.secondarySideBarWidth).toBe(280)
  expect(newState.mainWidth).toBe(872)
  expect(target === 'primary' ? newState.sideBarLeft : newState.secondarySideBarLeft).toBe(side === 2 ? 872 : 48)
  expect(newState.mainLeft).toBe(side === 2 ? 0 : 328)
  expect(load).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'Settings', parentUid: 1, width: 872, height: 760, show: false, type: 0, setBounds: false }),
    true,
    false,
  )
  const dom = getLayoutVirtualDom(newState)
  expect(dom[0].className).toContain('AiNativeSettingsOpen')
  expect(dom).toContainEqual(expect.objectContaining({ ariaLabel: 'Close Settings', onClick: 'closeSettings' }))
  expect(dom).toContainEqual(expect.objectContaining({ uid: 42 }))
  // Validate flat virtual DOM child counts, including the retained sidebar reference.
  let remaining = 1
  for (const node of dom) {
    remaining--
    expect(remaining).toBeGreaterThanOrEqual(0)
    remaining += node.childCount || 0
  }
  expect(remaining).toBe(0)
})

test('repeated opening reuses the existing settings view', async () => {
  const { newState } = await Settings.openSettings(createState())
  expect(await Settings.openSettings(newState)).toEqual({ newState, commands: [] })
  expect(load).toHaveBeenCalledTimes(1)
})

test('closing disposes settings and restores the retained chat bounds', async () => {
  const state = createState()
  const opened = await Settings.openSettings(state)
  const { newState, commands } = await Settings.closeSettings(opened.newState)
  expect(disposeFunctional).toHaveBeenCalledWith(42)
  expect(commands).toContainEqual(['Viewlet.dispose', 42])
  expect(newState.aiNativeSettingsId).toBeUndefined()
  expect(newState.sideBarWidth).toBe(state.sideBarWidth)
  expect(newState.sideBarId).toBe(state.sideBarId)
  expect(newState.aiNativeLayout).toBe(true)
})

test('narrow windows keep nonnegative settings and sidebar bounds after resize', async () => {
  const opened = await Settings.openSettings(createState(1, 'secondary'))
  const state = getPoints({ ...opened.newState, windowWidth: 320, windowHeight: 30 })
  expect(state.secondarySideBarWidth).toBeCloseTo(87.04)
  expect(state.mainWidth).toBeCloseTo(184.96)
  await Settings.resizeSettings(state)
  expect(resize).toHaveBeenCalledWith(42, expect.objectContaining({ width: state.mainWidth, height: 0 }))
})
