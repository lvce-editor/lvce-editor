import * as LazyCommand from '../LazyCommand/LazyCommand.js'
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
  acceptNewFile:                  ViewletExplorer.acceptNewFile,
  acceptRename:                   ViewletExplorer.acceptRename,
  cancelNewFile:                  ViewletExplorer.cancelNewFile,
  cancelRename:                   ViewletExplorer.cancelRename,
  collapseAll:                    ViewletExplorer.collapseAll,
  copyPath:                       ViewletExplorer.copyPath,
  copyRelativePath:               ViewletExplorer.copyRelativePath,
  expandAll:                      ViewletExplorer.expandAll,
  expandRecursively:              LazyCommand.create(ViewletExplorer.name, Imports.ExpandRecursively, 'expandRecursively'),
  focus:                          LazyCommand.create(ViewletExplorer.name, Imports.Focus, 'focus'),
  focusFirst:                     LazyCommand.create(ViewletExplorer.name, Imports.FocusFirst, 'focusFirst'),
  focusIndex:                     LazyCommand.create(ViewletExplorer.name, Imports.FocusIndex, 'focusIndex'),
  focusLast:                      LazyCommand.create(ViewletExplorer.name, Imports.FocusLast, 'focusLast'),
  focusNext:                      LazyCommand.create(ViewletExplorer.name, Imports.FocusNext, 'focusNext'),
  focusNone:                      LazyCommand.create(ViewletExplorer.name, Imports.FocusNone, 'focusNone'),
  focusPrevious:                  LazyCommand.create(ViewletExplorer.name, Imports.FocusPrevious, 'focusPrevious'),
  getFocusedDirent:               ViewletExplorer.getFocusedDirent,
  handleArrowLeft:                ViewletExplorer.handleArrowLeft,
  handleArrowRight:               ViewletExplorer.handleArrowRight,
  handleBlur:                     ViewletExplorer.handleBlur,
  handleClick:                    ViewletExplorer.handleClick,
  handleClickAt:                  ViewletExplorer.handleClickAt,
  handleClickCurrent:             ViewletExplorer.handleClickCurrent,
  handleClickCurrentButKeepFocus: ViewletExplorer.handleClickCurrentButKeepFocus,
  handleContextMenuKeyboard:      LazyCommand.create(ViewletExplorer.name, Imports.HandleContextMenuKeyboard, 'handleContextMenuKeyboard'),
  handleContextMenuMouseAt:       LazyCommand.create(ViewletExplorer.name, Imports.HandleContextMenuMouseAt, 'handleContextMenuMouseAt'),
  handleCopy:                     ViewletExplorer.handleCopy,
  handleDragOver:                 LazyCommand.create(ViewletExplorer.name, Imports.HandleDragOver, 'handleDragOver'),
  handleDrop:                     LazyCommand.create(ViewletExplorer.name, Imports.HandleDrop, 'handleDrop'),
  handleMouseEnter:               ViewletExplorer.handleMouseEnter,
  handleMouseLeave:               ViewletExplorer.handleMouseLeave,
  handlePaste:                    LazyCommand.create(ViewletExplorer.name, Imports.HandlePaste, 'handlePaste'),
  handleWheel:                    ViewletExplorer.handleWheel,
  newFile:                        ViewletExplorer.newFile,
  newFolder:                      ViewletExplorer.newFolder,
  openContainingFolder:           ViewletExplorer.openContainingFolder,
  removeDirent:                   ViewletExplorer.removeDirent,
  renameDirent:                   ViewletExplorer.renameDirent,
  revealItem:                     ViewletExplorer.revealItem,
  scrollDown:                     ViewletExplorer.scrollDown,
  scrollUp:                       ViewletExplorer.scrollUp,
  setDeltaY:                      ViewletExplorer.setDeltaY,
}

export const Css = '/css/parts/ViewletExplorer.css'

export * from './ViewletExplorer.js'
