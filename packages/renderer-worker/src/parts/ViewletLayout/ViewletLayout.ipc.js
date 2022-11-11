import * as ViewletLayout from './ViewletLayout.js'

// prettier-ignore
export const Commands = {

  'Layout.handleSashPointerDown': ViewletLayout.handleSashPointerDown,
}

export const CommandsWithSideEffects = {
  handleResize: ViewletLayout.handleResize,
  handleSashDoubleClick: ViewletLayout.handleSashDoubleClick,
  handleSashPointerMove: ViewletLayout.handleSashPointerMove,
  hideActivityBar: ViewletLayout.hideActivityBar,
  hideMain: ViewletLayout.hideMain,
  hidePanel: ViewletLayout.hidePanel,
  hideSideBar: ViewletLayout.hideSideBar,
  hideStatusBar: ViewletLayout.hideStatusBar,
  hideTitleBar: ViewletLayout.hideTitleBar,
  loadActivityBarIfVisible: ViewletLayout.loadActivityBarIfVisible,
  loadMainIfVisible: ViewletLayout.loadMainIfVisible,
  loadPanelIfVisible: ViewletLayout.loadPanelIfVisible,
  loadSideBarIfVisible: ViewletLayout.loadSideBarIfVisible,
  loadStatusBarIfVisible: ViewletLayout.loadStatusBarIfVisible,
  loadTitleBarIfVisible: ViewletLayout.loadTitleBarIfVisible,
  showActivityBar: ViewletLayout.showActivityBar,
  showMain: ViewletLayout.showMain,
  showPanel: ViewletLayout.showPanel,
  showSideBar: ViewletLayout.showSideBar,
  showStatusBar: ViewletLayout.showStatusBar,
  showTitleBar: ViewletLayout.showTitleBar,
  toggleActivityBar: ViewletLayout.toggleActivityBar,
  toggleMain: ViewletLayout.toggleMain,
  togglePanel: ViewletLayout.togglePanel,
  toggleSideBar: ViewletLayout.toggleSideBar,
  toggleStatusBar: ViewletLayout.toggleStatusBar,
  toggleTitleBar: ViewletLayout.toggleTitleBar,
  moveSideBarLeft: ViewletLayout.moveSideBarLeft,
  moveSideBarRight: ViewletLayout.moveSideBarRight,
}

export * from './ViewletLayout.js'
