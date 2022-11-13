import * as ViewletExplorer from './ViewletExplorer.js'

export const name = 'Explorer'

export const Events = {
  'languages.changed': ViewletExplorer.handleLanguagesChanged,
  'workspace.change': ViewletExplorer.handleWorkspaceChange,
}

// prettier-ignore
export const Commands = {
  acceptEdit:                     ViewletExplorer.acceptEdit,
  cancelEdit:                     ViewletExplorer.cancelEdit,
  collapseAll:                    ViewletExplorer.collapseAll,
  copyPath:                       ViewletExplorer.copyPath,
  copyRelativePath:               ViewletExplorer.copyRelativePath,
  expandAll:                      ViewletExplorer.expandAll,
  getFocusedDirent:               ViewletExplorer.getFocusedDirent,
  handleArrowLeft:                ViewletExplorer.handleArrowLeft,
  handleArrowRight:               ViewletExplorer.handleArrowRight,
  handleBlur:                     ViewletExplorer.handleBlur,
  handleClick:                    ViewletExplorer.handleClick,
  handleClickAt:                  ViewletExplorer.handleClickAt,
  handleClickCurrent:             ViewletExplorer.handleClickCurrent,
  handleClickCurrentButKeepFocus: ViewletExplorer.handleClickCurrentButKeepFocus,
  handleCopy:                     ViewletExplorer.handleCopy,
  handleMouseEnter:               ViewletExplorer.handleMouseEnter,
  handleMouseLeave:               ViewletExplorer.handleMouseLeave,
  handleWheel:                    ViewletExplorer.handleWheel,
  newFile:                        ViewletExplorer.newFile,
  newFolder:                      ViewletExplorer.newFolder,
  openContainingFolder:           ViewletExplorer.openContainingFolder,
  removeDirent:                   ViewletExplorer.removeDirent,
  rename:                         ViewletExplorer.renameDirent,
  renameDirent:                   ViewletExplorer.renameDirent,
  revealItem:                     ViewletExplorer.revealItem,
  scrollDown:                     ViewletExplorer.scrollDown,
  scrollUp:                       ViewletExplorer.scrollUp,
  setDeltaY:                      ViewletExplorer.setDeltaY,
  updateEditingValue:             ViewletExplorer.updateEditingValue,
}

// prettier-ignore
export const LazyCommands = {
  expandRecursively: () => import('./ViewletExplorerExpandRecursively.js'),
  focus: () => import('./ViewletExplorerFocus.js'),
  focusFirst: () => import('./ViewletExplorerFocusFirst.js'),
  focusIndex: () => import('./ViewletExplorerFocusIndex.js'),
  focusLast: () => import('./ViewletExplorerFocusLast.js'),
  focusNext: () => import('./ViewletExplorerFocusNext.js'),
  focusNone: () => import('./ViewletExplorerFocusNone.js'),
  focusPrevious: () => import('./ViewletExplorerFocusPrevious.js'),
  handleContextMenuKeyboard: () => import('./ViewletExplorerHandleContextMenuKeyboard.js'),
  handleContextMenuMouseAt: ()=>import('./ViewletExplorerHandleContextMenuMouseAt.js'),
  handleDragOver: () => import('./ViewletExplorerHandleDragOver.js'),
  handleDrop: () => import('./ViewletExplorerHandleDrop.js'),
  handlePaste: () => import('./ViewletExplorerHandlePaste.js'),
}

export const Css = ['/css/parts/ViewletExplorer.css', '/css/parts/Label.css']

export * from './ViewletExplorer.js'
