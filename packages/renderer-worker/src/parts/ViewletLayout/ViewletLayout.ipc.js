import * as ViewletLayout from './ViewletLayout.js'

// prettier-ignore
export const Commands = {

  'Layout.handleSashPointerDown': ViewletLayout.handleSashPointerDown,
}

export const CommandsWithSideEffects = {
  'Layout.handleResize': ViewletLayout.handleResize,
  'Layout.handleSashDoubleClick': ViewletLayout.handleSashDoubleClick,
  'Layout.handleSashPointerMove': ViewletLayout.handleSashPointerMove,
  'Layout.hideActivityBar': ViewletLayout.hideActivityBar,
  'Layout.hideMain': ViewletLayout.hideMain,
  'Layout.hidePanel': ViewletLayout.hidePanel,
  'Layout.hideSideBar': ViewletLayout.hideSideBar,
  'Layout.hideStatusBar': ViewletLayout.hideStatusBar,
  'Layout.hideTitleBar': ViewletLayout.hideTitleBar,
  'Layout.loadActivityBarIfVisible': ViewletLayout.loadActivityBarIfVisible,
  'Layout.loadMainIfVisible': ViewletLayout.loadMainIfVisible,
  'Layout.loadPanelIfVisible': ViewletLayout.loadPanelIfVisible,
  'Layout.loadSideBarIfVisible': ViewletLayout.loadSideBarIfVisible,
  'Layout.loadStatusBarIfVisible': ViewletLayout.loadStatusBarIfVisible,
  'Layout.loadTitleBarIfVisible': ViewletLayout.loadTitleBarIfVisible,
  'Layout.showActivityBar': ViewletLayout.showActivityBar,
  'Layout.showMain': ViewletLayout.showMain,
  'Layout.showPanel': ViewletLayout.showPanel,
  'Layout.showSideBar': ViewletLayout.showSideBar,
  'Layout.showStatusBar': ViewletLayout.showStatusBar,
  'Layout.showTitleBar': ViewletLayout.showTitleBar,
  'Layout.toggleActivityBar': ViewletLayout.toggleActivityBar,
  'Layout.toggleMain': ViewletLayout.toggleMain,
  'Layout.togglePanel': ViewletLayout.togglePanel,
  'Layout.toggleSideBar': ViewletLayout.toggleSideBar,
  'Layout.toggleStatusBar': ViewletLayout.toggleStatusBar,
  'Layout.toggleTitleBar': ViewletLayout.toggleTitleBar,
  'Layout.moveSideBarLeft': ViewletLayout.moveSideBarLeft,
  'Layout.moveSideBarRight': ViewletLayout.moveSideBarRight,
}

export * from './ViewletLayout.js'
