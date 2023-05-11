import * as ViewletMain from './ViewletMain.js'
import * as ViewletMainOpenUri from './ViewletMainOpenUri.js'

export const Commands = {
  focus: ViewletMain.focus,
  handleDragEnd: ViewletMain.handleDragEnd,
  handleDragOver: ViewletMain.handleDragOver,
  handleTabContextMenu: ViewletMain.handleTabContextMenu,
  openBackgroundTab: ViewletMain.openBackgroundTab,
  save: ViewletMain.save,
  handleClickClose: ViewletMain.handleClickClose,
}

export const CommandsWithSideEffects = {
  openUri: ViewletMainOpenUri.openUri,
  handleDrop: ViewletMain.handleDrop,
  handleDropFilePath: ViewletMain.handleDropFilePath,
  closeFocusedTab: ViewletMain.closeFocusedTab,
}

export const CommandsWithSideEffectsLazy = {
  closeTabsLeft: () => import('./ViewletMainCloseTabsLeft.js'),
  closeTabsRight: () => import('./ViewletMainCloseTabsRight.js'),
  closeOthers: () => import('./ViewletMainCloseOthers.js'),
  closeAllEditors: () => import('./ViewletMainCloseAllEditors.js'),
  closeActiveEditor: () => import('./ViewletMainCloseActiveEditor.js'),
  closeEditor: () => import('./ViewletMainCloseEditor.js'),
  focusFirst: () => import('./ViewletMainFocusIndex.js'),
  focusLast: () => import('./ViewletMainFocusIndex.js'),
  focusNext: () => import('./ViewletMainFocusIndex.js'),
  focusPrevious: () => import('./ViewletMainFocusIndex.js'),
}

export const LazyCommands = {
  handleTabsWheel: () => import('./ViewletMainHandleTabsWheel.js'),
  handleTabClick: () => import('./ViewletMainFocusIndex.js'),
}
