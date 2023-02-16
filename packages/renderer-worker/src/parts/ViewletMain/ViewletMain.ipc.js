import * as ViewletMain from './ViewletMain.js'

export const name = 'Main'

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
  handleTabClick: ViewletMain.handleTabClick,
  handleTabContextMenu: ViewletMain.handleTabContextMenu,
  openBackgroundTab: ViewletMain.openBackgroundTab,
  save: ViewletMain.save,
}

export const LazyCommands = {
  handleDrop: () => import('./ViewletMainHandleDrop.js'),
  handleDropFilePath: () => import('./ViewletMainHandleDropFilePath.js'),
  openUri: () => import('./ViewletMainOpenUri.js'),
  handleSashPointerDown: () => import('./ViewletMainHandleSashPointerDown.js'),
  handleSashPointerMoveHorizontal: () => import('./ViewletMainHandleSashPointerMoveHorizontal.js'),
  handleSashPointerMoveVertical: () => import('./ViewletMainHandleSashPointerMoveVertical.js'),
}

export const Css = ['/css/parts/ViewletMain.css', '/css/parts/EditorTabs.css']

export * from './ViewletMain.js'
