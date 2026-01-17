import * as ViewletMain from './ViewletMain.js'
import * as ViewletMainOpenUri from './ViewletMainOpenUri.ts'

export const Commands = {
  focus: ViewletMain.focus,
  handleDragEnd: ViewletMain.handleDragEnd,
  handleDragOver: ViewletMain.handleDragOver,
  handleDragLeave: ViewletMain.handleDragLeave,
  handleTabContextMenu: ViewletMain.handleTabContextMenu,
  openBackgroundTab: ViewletMain.openBackgroundTab,
  save: ViewletMain.save,
  handleClickClose: ViewletMain.handleClickClose,
  reopenEditorWith: ViewletMain.reopenEditorWith,
  openKeyBindings: ViewletMain.openKeyBindings,
  hotReload: ViewletMain.hotReload,
}

export const CommandsWithSideEffects = {
  openUri: ViewletMainOpenUri.openUri,
  handleDrop: ViewletMain.handleDrop,
  handleTabDrop: ViewletMain.handleTabDrop,
  handleTabsDragOver: ViewletMain.handleTabsDragOver,
}

export const CommandsWithSideEffectsLazy = {
  closeTabsLeft: () => import('./ViewletMainCloseTabsLeft.ts'),
  closeTabsRight: () => import('./ViewletMainCloseTabsRight.ts'),
  closeOthers: () => import('./ViewletMainCloseOthers.ts'),
  closeAllEditors: () => import('./ViewletMainCloseAllEditors.ts'),
  closeActiveEditor: () => import('./ViewletMainCloseActiveEditor.ts'),
  closeFocusedTab: () => import('./ViewletMainCloseActiveEditor.ts'),
  closeEditor: () => import('./ViewletMainCloseEditor.ts'),
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
