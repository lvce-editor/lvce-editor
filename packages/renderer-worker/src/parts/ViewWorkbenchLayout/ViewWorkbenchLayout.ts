import * as ViewletLayout from '../ViewletLayout/ViewletLayout.ts'
import type { LayoutState } from '../ViewletLayout/LayoutState.ts'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import type { ViewletExtensionViewState } from '../ViewletExtensionView/ViewletExtensionViewState.ts'

// Return commands to the view's pending render, never send an intermediate frame.
export const prepare = async (view: ViewletExtensionViewState): Promise<readonly (readonly unknown[])[]> => {
  if (view.disabled || (view.workbenchLayout !== 'ide' && view.workbenchLayout !== 'ai-native')) {
    return []
  }
  const layout = ViewletStates.getInstance(ViewletModuleId.Layout, view.applicationId)
  if (!layout) {
    return []
  }
  const state = layout.state as LayoutState
  const primary = ViewletStates.getInstance(state.sideBarId)
  const secondary = ViewletStates.getInstance(state.secondarySideBarId)
  const target = primary?.state.childUid === view.uid ? 'primary' : secondary?.state.childUid === view.uid ? 'secondary' : undefined
  if (target === undefined) {
    return []
  }
  const enabled = view.workbenchLayout === 'ai-native'
  if (enabled === state.aiNativeLayout || (enabled && state.aiNativeLayoutExited) || (!enabled && state.sideBarFocusModeTarget !== target)) {
    return []
  }
  const result = enabled ? await ViewletLayout.enterSideBarFocusMode(state, target, true) : await ViewletLayout.leaveSideBarFocusMode(state)
  if (result.newState === state) {
    return []
  }
  const commands = [...result.commands, ...ViewletManager.render(layout.factory, layout.renderedState, result.newState)]
  ViewletStates.setRenderedState(state.uid, result.newState)
  return commands
}
