import * as ViewletMain from './ViewletMain.js'
import * as ViewletMainOpenUri from './ViewletMainOpenUri.js'

export const Commands = {
  focus: ViewletMain.focus,
  handleDragEnd: ViewletMain.handleDragEnd,
  handleDragOver: ViewletMain.handleDragOver,
  handleDragLeave: ViewletMain.handleDragLeave,
  handleTabContextMenu: ViewletMain.handleTabContextMenu,
  openBackgroundTab: ViewletMain.openBackgroundTab,
  save: ViewletMain.save,
  handleClickClose: ViewletMain.handleClickClose,
}

export const CommandsWithSideEffects = {
  openUri: ViewletMainOpenUri.openUri,
  handleDrop: ViewletMain.handleDrop,
}

export const CommandsWithSideEffectsLazy = {
  closeTabsLeft: () => import('./ViewletMainCloseTabsLeft.js'),
  closeTabsRight: () => import('./ViewletMainCloseTabsRight.js'),
  closeOthers: () => import('./ViewletMainCloseOthers.js'),
  closeAllEditors: () => import('./ViewletMainCloseAllEditors.js'),
  closeActiveEditor: () => import('./ViewletMainCloseActiveEditor.js'),
  closeFocusedTab: () => import('./ViewletMainCloseActiveEditor.js'),
  closeEditor: () => import('./ViewletMainCloseEditor.js'),
  focusFirst: () => import('./ViewletMainFocusIndex.js'),
  focusLast: () => import('./ViewletMainFocusIndex.js'),
  focusNext: () => import('./ViewletMainFocusIndex.js'),
  focusPrevious: () => import('./ViewletMainFocusIndex.js'),
  handleDropFilePath: () => import('./ViewletMainHandleDropFilePath.js'),
  splitRight: () => import('./ViewletMainSplitRight.ts'),
}

export const LazyCommands = {
  handleTabsWheel: () => import('./ViewletMainHandleTabsWheel.js'),
  handleTabClick: () => import('./ViewletMainFocusIndex.js'),
  handleTabsPointerOver: () => import('./ViewletMainHandleTabsPointerOver.js'),
  handleTabsPointerOut: () => import('./ViewletMainHandleTabsPointerOut.js'),
  handleContextMenu: () => import('./ViewletMainHandleContextMenu.js'),
  findFileReferences: () => import('./ViewletMainFindFileReferences.js'),
}
