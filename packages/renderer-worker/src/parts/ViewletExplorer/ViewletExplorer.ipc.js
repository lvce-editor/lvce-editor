import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletExplorer from './ViewletExplorer.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

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

// prettier-ignore
export const Commands = {
  'Explorer.acceptNewFile':                  Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.acceptNewFile),
  'Explorer.acceptRename':                   Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.acceptRename),
  'Explorer.cancelNewFile':                  Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.cancelNewFile),
  'Explorer.cancelRename':                   Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.cancelRename),
  'Explorer.collapseAll':                    Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.collapseAll),
  'Explorer.copyPath':                       Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.copyPath),
  'Explorer.copyRelativePath':               Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.copyRelativePath),
  'Explorer.expandAll':                      Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.expandAll),
  'Explorer.expandRecursively':              LazyCommand.create(ViewletExplorer.name, Imports.ExpandRecursively, 'expandRecursively'),
  'Explorer.focus':                          LazyCommand.create(ViewletExplorer.name, Imports.Focus, 'focus'),
  'Explorer.focusFirst':                     LazyCommand.create(ViewletExplorer.name, Imports.FocusFirst, 'focusFirst'),
  'Explorer.focusIndex':                     LazyCommand.create(ViewletExplorer.name, Imports.FocusIndex, 'focusIndex'),
  'Explorer.focusLast':                      LazyCommand.create(ViewletExplorer.name, Imports.FocusLast, 'focusLast'),
  'Explorer.focusNext':                      LazyCommand.create(ViewletExplorer.name, Imports.FocusNext, 'focusNext'),
  'Explorer.focusNone':                      LazyCommand.create(ViewletExplorer.name, Imports.FocusNone, 'focusNone'),
  'Explorer.focusPrevious':                  LazyCommand.create(ViewletExplorer.name, Imports.FocusPrevious, 'focusPrevious'),
  'Explorer.getFocusedDirent':               Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.getFocusedDirent),
  'Explorer.handleArrowLeft':                Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleArrowLeft),
  'Explorer.handleArrowRight':               Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleArrowRight),
  'Explorer.handleBlur':                     Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleBlur),
  'Explorer.handleClick':                    Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleClick),
  'Explorer.handleClickAt':                  Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleClickAt),
  'Explorer.handleClickCurrent':             Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleClickCurrent),
  'Explorer.handleClickCurrentButKeepFocus': Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleClickCurrentButKeepFocus),
  'Explorer.handleContextMenuKeyboard':      LazyCommand.create(ViewletExplorer.name, Imports.HandleContextMenuKeyboard, 'handleContextMenuKeyboard'),
  'Explorer.handleContextMenuMouseAt':       LazyCommand.create(ViewletExplorer.name, Imports.HandleContextMenuMouseAt, 'handleContextMenuMouseAt'),
  'Explorer.handleCopy':                     Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleCopy),
  'Explorer.handleDragOver':                 LazyCommand.create(ViewletExplorer.name, Imports.HandleDragOver, 'handleDragOver'),
  'Explorer.handleDrop':                     LazyCommand.create(ViewletExplorer.name, Imports.HandleDrop, 'handleDrop'),
  'Explorer.handleMouseEnter':               Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleMouseEnter),
  'Explorer.handleMouseLeave':               Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleMouseLeave),
  'Explorer.handlePaste':                    LazyCommand.create(ViewletExplorer.name, Imports.HandlePaste, 'handlePaste'),
  'Explorer.handleWheel':                    Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.handleWheel),
  'Explorer.newFile':                        Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.newFile),
  'Explorer.newFolder':                      Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.newFolder),
  'Explorer.openContainingFolder':           Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.openContainingFolder),
  'Explorer.removeDirent':                   Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.removeDirent),
  'Explorer.renameDirent':                   Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.renameDirent),
  'Explorer.revealItem':                     Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.revealItem),
  'Explorer.scrollDown':                     Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.scrollDown),
  'Explorer.scrollUp':                       Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.scrollUp),
  'Explorer.setDeltaY':                      Viewlet.wrapViewletCommand(ViewletExplorer.name, ViewletExplorer.setDeltaY),
}

export * from './ViewletExplorer.js'
