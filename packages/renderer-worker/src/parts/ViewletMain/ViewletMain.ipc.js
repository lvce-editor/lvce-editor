import * as ViewletMain from './ViewletMain.js'

// prettier-ignore
export const Commands = {
  closeActiveEditor: ViewletMain.closeActiveEditor,
  closeAllEditors: ViewletMain.closeAllEditors,
  closeEditor: ViewletMain.closeEditor,
  closeFocusedTab: ViewletMain.closeFocusedTab,
  closeOthers: ViewletMain.closeOthers,
  closeTabsLeft: ViewletMain.closeTabsLeft,
  closeTabsRight: ViewletMain.closeTabsRight,
  focusFirst: ViewletMain.focusFirst,
  focusLast: ViewletMain.focusLast,
  focusNext: ViewletMain.focusNext,
  focusPrevious: ViewletMain.focusPrevious,
  handleDrop: ViewletMain.handleDrop,
  handleTabClick: ViewletMain.handleTabClick,
  handleTabContextMenu: ViewletMain.handleTabContextMenu,
  openBackgroundTab: ViewletMain.openBackgroundTab,
  openUri: ViewletMain.openUri,
  save: ViewletMain.save,
  // 'Main.hydrate': ViewletMain.hydrate,
}

export const Css = '/css/parts/ViewletMain.css'

export * from './ViewletMain.js'
