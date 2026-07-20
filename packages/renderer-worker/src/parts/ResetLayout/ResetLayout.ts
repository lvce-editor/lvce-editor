import type { LayoutState, LayoutStateResult } from '../ViewletLayout/LayoutState.ts'
import * as Command from '../Command/Command.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const defaultColorTheme = 'slime'
const defaultTitleTemplate = '${folderName}'

const closeWidgets = async (): Promise<void> => {
  await Promise.all([
    Command.execute('Viewlet.closeWidget', ViewletModuleId.QuickPick),
    Command.execute('Viewlet.closeWidget', ViewletModuleId.About),
    Command.execute('Viewlet.closeWidget', ViewletModuleId.Dialog),
    Command.execute('Viewlet.closeWidget', ViewletModuleId.Confirm),
  ])
}

const resetTitleBar = async (titleBarWidth: number): Promise<void> => {
  await Command.execute('TitleBar.closeMenu')
  await Command.execute('TitleBar.setTitleTemplate', defaultTitleTemplate)
  await Command.execute('TitleBar.setWidth', titleBarWidth)
}

const resetWorkspace = async (): Promise<void> => {
  await Command.execute('Main.closeAllEditors')
  const workspacePath = await Command.execute('Workspace.getPath')
  if (workspacePath) {
    await Command.execute('Workspace.close')
  }
}

const resetSideBar = async (sideBarFocusMode: boolean, sideBarLocation: number, sideBarView: string, sideBarVisible: boolean): Promise<void> => {
  if (sideBarFocusMode) {
    await Command.execute('Layout.leaveSideBarFocusMode')
  }
  if (sideBarLocation !== SideBarLocationType.Right) {
    await Command.execute('Layout.moveSideBarRight')
  }
  if (!sideBarVisible || sideBarView !== ViewletModuleId.Explorer) {
    await Command.execute('Layout.showSideBar', ViewletModuleId.Explorer, false)
  }
}

const resetPanel = async (panelMaximized: boolean, panelView: string, panelVisible: boolean): Promise<void> => {
  const panelViewNeedsReset = panelView !== ViewletModuleId.Problems
  if (!panelVisible && !panelViewNeedsReset) {
    return
  }
  if (panelMaximized) {
    await Command.execute('Layout.unmaximizePanel')
  }
  if (panelViewNeedsReset) {
    await Command.execute('Layout.showPanel', ViewletModuleId.Problems)
  }
  await Command.execute('Layout.hidePanel')
}

const resetActivityBar = async (): Promise<void> => {
  await Command.execute('ActivityBar.reset')
}

export const reset = async (state: Readonly<LayoutState>): Promise<LayoutStateResult> => {
  const { panelMaximized, panelView, panelVisible, sideBarFocusMode, sideBarLocation, sideBarView, sideBarVisible, titleBarWidth } = state
  await Promise.all([
    Command.execute('Menu.hide', false),
    resetTitleBar(titleBarWidth),
    closeWidgets(),
    Command.execute('ColorTheme.setColorTheme', defaultColorTheme),
    resetWorkspace(),
  ])
  await Promise.all([
    resetSideBar(sideBarFocusMode, sideBarLocation, sideBarView, sideBarVisible),
    resetPanel(panelMaximized, panelView, panelVisible),
  ])
  await resetActivityBar()
  return {
    commands: [],
    newState: state,
  }
}
