import * as ViewletMain from './ViewletMain.js'
import * as ViewletMainOpenUri from './ViewletMainOpenUri.js'

export const Commands = {
  // 'Main.hydrate': ViewletMain.hydrate,
  closeActiveEditor: ViewletMain.closeActiveEditor,
  closeAllEditors: ViewletMain.closeAllEditors,
  closeEditor: ViewletMain.closeEditor,
  closeFocusedTab: ViewletMain.closeFocusedTab,
  closeOthers: ViewletMain.closeOthers,
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

export const LazyCommands = {
  closeTabsLeft: () => import('./ViewletMainCloseTabsLeft.js'),
  closeTabsRight: () => import('./ViewletMainCloseTabsRight.js'),
}

export const CommandsWithSideEffects = {
  openUri: ViewletMainOpenUri.openUri,
  handleDrop: ViewletMain.handleDrop,
  handleDropFilePath: ViewletMain.handleDropFilePath,
}
