import * as ViewletMain from './ViewletMain.js'
import * as ViewletMainOpenUri from './ViewletMainOpenUri.js'

export const Commands = {
  // 'Main.hydrate': ViewletMain.hydrate,

  focus: ViewletMain.focus,
  focusFirst: ViewletMain.focusFirst,
  focusLast: ViewletMain.focusLast,
  focusNext: ViewletMain.focusNext,
  focusPrevious: ViewletMain.focusPrevious,
  handleDragEnd: ViewletMain.handleDragEnd,
  handleDragOver: ViewletMain.handleDragOver,
  handleTabClick: ViewletMain.handleTabClick,
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
