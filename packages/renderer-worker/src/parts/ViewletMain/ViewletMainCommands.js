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
  closeAllEditors: ViewletMain.closeAllEditors,
  closeActiveEditor: ViewletMain.closeActiveEditor,
  closeEditor: ViewletMain.closeEditor,
  closeFocusedTab: ViewletMain.closeFocusedTab,
}

export const CommandsWithSideEffectsLazy = {
  closeTabsLeft: () => import('./ViewletMainCloseTabsLeft.js'),
  closeTabsRight: () => import('./ViewletMainCloseTabsRight.js'),
  closeOthers: () => import('./ViewletMainCloseOthers.js'),
}

export const LazyCommands = {
  focusFirst: () => import('./ViewletMainFocusIndex.js'),
  focusLast: () => import('./ViewletMainFocusIndex.js'),
  focusNext: () => import('./ViewletMainFocusIndex.js'),
  focusPrevious: () => import('./ViewletMainFocusIndex.js'),
  handleTabClick: () => import('./ViewletMainFocusIndex.js'),
}
