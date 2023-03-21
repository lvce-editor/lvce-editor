import * as ViewletMain from './ViewletMain.js'

// prettier-ignore
export const Commands = {
  // 'Main.hydrate': ViewletMain.hydrate,
  closeActiveEditor: ViewletMain.closeActiveEditor,
  closeAllEditors: ViewletMain.closeAllEditors,
  closeEditor: ViewletMain.closeEditor,
  closeFocusedTab: ViewletMain.closeFocusedTab,
  closeOthers: ViewletMain.closeOthers,
  closeTabsLeft: ViewletMain.closeTabsLeft,
  closeTabsRight: ViewletMain.closeTabsRight,
  focus: ViewletMain.focus,
  focusFirst: ViewletMain.focusFirst,
  focusLast: ViewletMain.focusLast,
  focusNext: ViewletMain.focusNext,
  focusPrevious: ViewletMain.focusPrevious,
  handleDragEnd: ViewletMain.handleDragEnd,
  handleDragOver: ViewletMain.handleDragOver,
  handleDropFilePath: ViewletMain.handleDropFilePath,
  handleTabClick: ViewletMain.handleTabClick,
  handleTabContextMenu: ViewletMain.handleTabContextMenu,
  openBackgroundTab: ViewletMain.openBackgroundTab,
  save: ViewletMain.save,
}

export const CommandsWithSideEffects = {
  openUri: ViewletMain.openUri,
  handleDrop: ViewletMain.handleDrop,
}
