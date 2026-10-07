import { beforeEach, expect, jest, test } from '@jest/globals'
import type { LayoutState } from '../src/parts/ViewletLayout/LayoutState.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/ViewletLayout/ViewletLayout.ts', () => ({
  enterSideBarFocusMode: jest.fn(),
  leaveSideBarFocusMode: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ render: jest.fn(() => [['Viewlet.setDom2', 1, ['layout']]]) }))

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewWorkbenchLayout = await import('../src/parts/ViewWorkbenchLayout/ViewWorkbenchLayout.ts')
const ViewletExtensionView = await import('../src/parts/ViewletExtensionView/ViewletExtensionView.ts')

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.reset()
})

const setup = (aiNativeLayout = false, target: 'primary' | 'secondary' = 'primary'): LayoutState => {
  const state = { aiNativeLayout, sideBarFocusModeTarget: target, sideBarId: 2, secondarySideBarId: 3, uid: 1 }
  ViewletStates.set(1, { moduleId: 'Layout', factory: {}, state, renderedState: state })
  for (const [uid, childUid] of [
    [2, 4],
    [3, 5],
  ]) {
    ViewletStates.set(uid, { moduleId: `Sidebar${uid}`, factory: {}, state: { childUid, uid }, renderedState: { childUid, uid } })
  }
  return state as LayoutState
}

for (const [uid, target] of [
  [4, 'primary'],
  [5, 'secondary'],
] as const) {
  test(`collects ${target} sidebar layout without an intermediate renderer RPC`, async () => {
    const state = setup()
    const newState = { ...state, aiNativeLayout: true, sideBarFocusModeTarget: target }
    jest.mocked(ViewletLayout.enterSideBarFocusMode).mockResolvedValue({ newState, commands: [['Viewlet.setBounds', uid, 0, 0, 1000, 700]] } as never)
    const view = { ...ViewletExtensionView.create(uid, 'sample', 0, 0, 240, 500), workbenchLayout: 'ai-native' as const }

    const commands = await ViewWorkbenchLayout.prepare(view)

    expect(ViewletLayout.enterSideBarFocusMode).toHaveBeenCalledWith(state, target, true)
    expect(commands).toEqual([
      ['Viewlet.setBounds', uid, 0, 0, 1000, 700],
      ['Viewlet.setDom2', 1, ['layout']],
    ])
    expect(ViewletStates.getInstance(1).state).toEqual(newState)
  })
}

test('leaves AI-native layout only for its owning sidebar', async () => {
  const state = setup(true)
  const newState = { ...state, aiNativeLayout: false }
  jest.mocked(ViewletLayout.leaveSideBarFocusMode).mockResolvedValue({ newState, commands: [] } as never)
  const otherView = { ...ViewletExtensionView.create(5, 'sample', 0, 0, 240, 500), workbenchLayout: 'ide' as const }
  expect(await ViewWorkbenchLayout.prepare(otherView)).toEqual([])
  expect(ViewletLayout.leaveSideBarFocusMode).not.toHaveBeenCalled()
  const owningView = { ...otherView, uid: 4 }
  await ViewWorkbenchLayout.prepare(owningView)
  expect(ViewletLayout.leaveSideBarFocusMode).toHaveBeenCalledWith(state)
})

test('ignores detached, disabled, unchanged and omitted layout requests', async () => {
  setup()
  const view = ViewletExtensionView.create(4, 'sample', 0, 0, 240, 500)
  for (const candidate of [
    view,
    { ...view, workbenchLayout: 'ide' as const },
    { ...view, uid: 99, workbenchLayout: 'ai-native' as const },
    { ...view, disabled: true, workbenchLayout: 'ai-native' as const },
  ]) {
    expect(await ViewWorkbenchLayout.prepare(candidate)).toEqual([])
  }
  expect(ViewletLayout.enterSideBarFocusMode).not.toHaveBeenCalled()
  expect(ViewletLayout.leaveSideBarFocusMode).not.toHaveBeenCalled()
})
