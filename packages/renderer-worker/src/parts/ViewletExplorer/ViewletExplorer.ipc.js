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
  'Explorer.acceptNewFile':                  ViewletExplorer.acceptNewFile,
  'Explorer.acceptRename':                   ViewletExplorer.acceptRename,
  'Explorer.cancelNewFile':                  ViewletExplorer.cancelNewFile,
  'Explorer.cancelRename':                   ViewletExplorer.cancelRename,
  'Explorer.collapseAll':                    ViewletExplorer.collapseAll,
  'Explorer.copyPath':                       ViewletExplorer.copyPath,
  'Explorer.copyRelativePath':               ViewletExplorer.copyRelativePath,
  'Explorer.expandAll':                      ViewletExplorer.expandAll,
  'Explorer.expandRecursively':              LazyCommand.create(ViewletExplorer.name, Imports.ExpandRecursively, 'expandRecursively'),
  'Explorer.focus':                          LazyCommand.create(ViewletExplorer.name, Imports.Focus, 'focus'),
  'Explorer.focusFirst':                     LazyCommand.create(ViewletExplorer.name, Imports.FocusFirst, 'focusFirst'),
  'Explorer.focusIndex':                     LazyCommand.create(ViewletExplorer.name, Imports.FocusIndex, 'focusIndex'),
  'Explorer.focusLast':                      LazyCommand.create(ViewletExplorer.name, Imports.FocusLast, 'focusLast'),
  'Explorer.focusNext':                      LazyCommand.create(ViewletExplorer.name, Imports.FocusNext, 'focusNext'),
  'Explorer.focusNone':                      LazyCommand.create(ViewletExplorer.name, Imports.FocusNone, 'focusNone'),
  'Explorer.focusPrevious':                  LazyCommand.create(ViewletExplorer.name, Imports.FocusPrevious, 'focusPrevious'),
  'Explorer.getFocusedDirent':               ViewletExplorer.getFocusedDirent,
  'Explorer.handleArrowLeft':                ViewletExplorer.handleArrowLeft,
  'Explorer.handleArrowRight':               ViewletExplorer.handleArrowRight,
  'Explorer.handleBlur':                     ViewletExplorer.handleBlur,
  'Explorer.handleClick':                    ViewletExplorer.handleClick,
  'Explorer.handleClickAt':                  ViewletExplorer.handleClickAt,
  'Explorer.handleClickCurrent':             ViewletExplorer.handleClickCurrent,
  'Explorer.handleClickCurrentButKeepFocus': ViewletExplorer.handleClickCurrentButKeepFocus,
  'Explorer.handleContextMenuKeyboard':      LazyCommand.create(ViewletExplorer.name, Imports.HandleContextMenuKeyboard, 'handleContextMenuKeyboard'),
  'Explorer.handleContextMenuMouseAt':       LazyCommand.create(ViewletExplorer.name, Imports.HandleContextMenuMouseAt, 'handleContextMenuMouseAt'),
  'Explorer.handleCopy':                     ViewletExplorer.handleCopy,
  'Explorer.handleDragOver':                 LazyCommand.create(ViewletExplorer.name, Imports.HandleDragOver, 'handleDragOver'),
  'Explorer.handleDrop':                     LazyCommand.create(ViewletExplorer.name, Imports.HandleDrop, 'handleDrop'),
  'Explorer.handleMouseEnter':               ViewletExplorer.handleMouseEnter,
  'Explorer.handleMouseLeave':               ViewletExplorer.handleMouseLeave,
  'Explorer.handlePaste':                    LazyCommand.create(ViewletExplorer.name, Imports.HandlePaste, 'handlePaste'),
  'Explorer.handleWheel':                    ViewletExplorer.handleWheel,
  'Explorer.newFile':                        ViewletExplorer.newFile,
  'Explorer.newFolder':                      ViewletExplorer.newFolder,
  'Explorer.openContainingFolder':           ViewletExplorer.openContainingFolder,
  'Explorer.removeDirent':                   ViewletExplorer.removeDirent,
  'Explorer.renameDirent':                   ViewletExplorer.renameDirent,
  'Explorer.revealItem':                     ViewletExplorer.revealItem,
  'Explorer.scrollDown':                     ViewletExplorer.scrollDown,
  'Explorer.scrollUp':                       ViewletExplorer.scrollUp,
  'Explorer.setDeltaY':                      ViewletExplorer.setDeltaY,
}

export const Css = '/css/parts/ViewletExplorer.css'

export * from './ViewletExplorer.js'
