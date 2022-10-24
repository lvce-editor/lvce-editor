import * as ViewletMain from './ViewletMain.js'

// prettier-ignore
export const Commands = {
  'Main.closeActiveEditor': ViewletMain.closeActiveEditor,
  'Main.closeAllEditors': ViewletMain.closeAllEditors,
  'Main.closeEditor': ViewletMain.closeEditor,
  'Main.closeFocusedTab': ViewletMain.closeFocusedTab,
  'Main.closeOthers': ViewletMain.closeOthers,
  'Main.closeTabsLeft': ViewletMain.closeTabsLeft,
  'Main.closeTabsRight': ViewletMain.closeTabsRight,
  'Main.focusFirst': ViewletMain.focusFirst,
  'Main.focusLast': ViewletMain.focusLast,
  'Main.focusNext': ViewletMain.focusNext,
  'Main.focusPrevious': ViewletMain.focusPrevious,
  'Main.handleDrop': ViewletMain.handleDrop,
  'Main.handleTabClick': ViewletMain.handleTabClick,
  'Main.handleTabContextMenu': ViewletMain.handleTabContextMenu,
  'Main.openUri': ViewletMain.openUri,
  'Main.save': ViewletMain.save,
  // 'Main.hydrate': ViewletMain.hydrate,
}

export const Css = '/css/parts/ViewletMain.css'

export * from './ViewletMain.js'
