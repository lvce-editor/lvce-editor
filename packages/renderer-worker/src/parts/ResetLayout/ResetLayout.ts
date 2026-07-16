import * as Command from '../Command/Command.js'
import type { LayoutState, LayoutStateResult } from '../ViewletLayout/LayoutState.ts'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const defaultColorTheme = 'slime'
const defaultTitleTemplate = '${folderName}'

const closeWidgets = async (): Promise<void> => {
  await Command.execute('Viewlet.closeWidget', ViewletModuleId.QuickPick)
  await Command.execute('Viewlet.closeWidget', ViewletModuleId.About)
  await Command.execute('Viewlet.closeWidget', ViewletModuleId.Dialog)
  await Command.execute('Viewlet.closeWidget', ViewletModuleId.Confirm)
}

const getActivityBarBounds = (): { readonly height: number; readonly width: number; readonly x: number; readonly y: number } => {
  const state: LayoutState = ViewletStates.getState(ViewletModuleId.Layout)
  return {
    height: state.activityBarHeight,
    width: state.activityBarWidth,
    x: state.activityBarLeft,
    y: state.activityBarTop,
  }
}

const resetActivityBar = async (): Promise<void> => {
  const { height, width, x, y } = getActivityBarBounds()
  await Command.execute('ActivityBar.create', '', x, y, width, height, null, null, -1)
  await Command.execute('ActivityBar.loadContent', {})
}

export const reset = async (state: LayoutState): Promise<LayoutStateResult> => {
  await Command.execute('Menu.hide', false)
  await Command.execute('TitleBar.closeMenu')
  await Command.execute('TitleBar.setTitleTemplate', defaultTitleTemplate)
  await Command.execute('TitleBar.setWidth', state.titleBarWidth)
  await closeWidgets()
  await Command.execute('ColorTheme.setColorTheme', defaultColorTheme)
  await Command.execute('Main.closeAllEditors')
  const workspacePath = await Command.execute('Workspace.getPath')
  if (workspacePath) {
    await Command.execute('Workspace.close')
  }
  if (state.sideBarFocusMode) {
    await Command.execute('Layout.leaveSideBarFocusMode')
  }
  if (state.sideBarLocation !== SideBarLocationType.Right) {
    await Command.execute('Layout.moveSideBarRight')
  }
  if (!state.sideBarVisible || state.sideBarView !== ViewletModuleId.Explorer) {
    await Command.execute('Layout.showSideBar', ViewletModuleId.Explorer)
  }
  const panelViewNeedsReset = state.panelView !== ViewletModuleId.Problems
  if (state.panelVisible || panelViewNeedsReset) {
    if (state.panelMaximized) {
      await Command.execute('Layout.unmaximizePanel')
    }
    if (panelViewNeedsReset) {
      await Command.execute('Layout.showPanel', ViewletModuleId.Problems)
    }
    await Command.execute('Layout.hidePanel')
  }
  await resetActivityBar()
  return {
    commands: [],
    newState: state,
  }
}
