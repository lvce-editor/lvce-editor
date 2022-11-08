import * as ViewletExplorer from './ViewletExplorer.js'

// prettier-ignore
const Imports = {
  ExpandRecursively: () => import('./ViewletExplorerExpandRecursively.js'),
  Focus: () => import('./ViewletExplorerFocus.js'),
  FocusFirst: () => import('./ViewletExplorerFocusFirst.js'),
  FocusIndex: () => import('./ViewletExplorerFocusIndex.js'),
  FocusLast: () => import('./ViewletExplorerFocusLast.js'),
  FocusNext: () => import('./ViewletExplorerFocusNext.js'),
  FocusNone: () => import('./ViewletExplorerFocusNone.js'),
  FocusPrevious: () => import('./ViewletExplorerFocusPrevious.js'),
  HandleContextMenuKeyboard: () => import('./ViewletExplorerHandleContextMenuKeyboard.js'),
  HandleContextMenuMouseAt: ()=>import('./ViewletExplorerHandleContextMenuMouseAt.js'),
  HandleDragOver: () => import('./ViewletExplorerHandleDragOver.js'),
  HandleDrop: () => import('./ViewletExplorerHandleDrop.js'),
  HandlePaste: () => import('./ViewletExplorerHandlePaste.js'),
}

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

export const LazyCommands = {
  expandRecursively: Imports.ExpandRecursively,
  focus: Imports.Focus,
  focusFirst: Imports.FocusFirst,
  focusIndex: Imports.FocusIndex,
  focusLast: Imports.FocusLast,
  focusNext: Imports.FocusNext,
  focusNone: Imports.FocusNone,
  focusPrevious: Imports.FocusPrevious,
  handleContextMenuKeyboard: Imports.HandleContextMenuKeyboard,
  handleContextMenuMouseAt: Imports.HandleContextMenuMouseAt,
  handleDragOver: Imports.HandleDragOver,
  handleDrop: Imports.HandleDrop,
  handlePaste: Imports.HandlePaste,
}

export const Css = '/css/parts/ViewletExplorer.css'

export * from './ViewletExplorer.js'
