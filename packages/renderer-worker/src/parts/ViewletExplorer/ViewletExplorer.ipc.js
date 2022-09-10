import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletExplorer from './ViewletExplorer.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  Focus: () => import('./ViewletExplorerFocus.js'),
  FocusFirst: () => import('./ViewletExplorerFocusFirst.js'),
  FocusIndex: () => import('./ViewletExplorerFocusIndex.js'),
  FocusLast: () => import('./ViewletExplorerFocusLast.js'),
  FocusNext: () => import('./ViewletExplorerFocusNext.js'),
  FocusPrevious: () => import('./ViewletExplorerFocusPrevious.js'),
  FocusNone: () => import('./ViewletExplorerFocusNone.js'),
  HandleContextMenuKeyboard: () => import('./ViewletExplorerHandleContextMenuKeyboard.js'),
  HandleContextMenuMouseAt: ()=>import('./ViewletExplorerHandleContextMenuMouseAt.js'),
  ExpandRecursively: () => import('./ViewletExplorerExpandRecursively.js'),
  HandleDrop: () => import('./ViewletExplorerHandleDrop.js'),

}

// prettier-ignore
export const Commands = {
  'Explorer.acceptNewFile':             Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptNewFile),
  'Explorer.acceptRename':              Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptRename),
  'Explorer.cancelNewFile':             Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelNewFile),
  'Explorer.cancelRename':              Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelRename),
  'Explorer.collapseAll':               Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.collapseAll),
  'Explorer.copyPath':                  Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyPath),
  'Explorer.copyRelativePath':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyRelativePath),
  'Explorer.expandAll':                 Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.expandAll),
  'Explorer.expandRecursively':         LazyCommand.create('Explorer', Imports.ExpandRecursively, 'expandRecursively'),
  'Explorer.focus':                     LazyCommand.create('Explorer', Imports.Focus, 'focus'),
  'Explorer.focusFirst':                LazyCommand.create('Explorer', Imports.FocusFirst, 'focusFirst'),
  'Explorer.focusIndex':                LazyCommand.create('Explorer', Imports.FocusIndex, 'focusIndex'),
  'Explorer.focusLast':                 LazyCommand.create('Explorer', Imports.FocusLast, 'focusLast'),
  'Explorer.focusNext':                 LazyCommand.create('Explorer', Imports.FocusNext, 'focusNext'),
  'Explorer.focusNone':                 LazyCommand.create('Explorer', Imports.FocusNone, 'focusNone'),
  'Explorer.focusPrevious':             LazyCommand.create('Explorer', Imports.FocusPrevious, 'focusPrevious'),
  'Explorer.getFocusedDirent':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.getFocusedDirent),
  'Explorer.handleArrowLeft':           Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowLeft),
  'Explorer.handleArrowRight':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowRight),
  'Explorer.handleBlur':                Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleBlur),
  'Explorer.handleClick':               Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClick),
  'Explorer.handleClickAt':             Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClickAt),
  'Explorer.handleClickCurrent':        Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClickCurrent),
  'Explorer.handleContextMenuKeyboard': LazyCommand.create('Explorer', Imports.HandleContextMenuKeyboard, 'handleContextMenuKeyboard'),
  'Explorer.handleContextMenuMouseAt':  LazyCommand.create('Explorer', Imports.HandleContextMenuMouseAt, 'handleContextMenuMouseAt'),
  'Explorer.handleCopy':                Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleCopy),
  'Explorer.handleDrop':                LazyCommand.create('Explorer', Imports.HandleDrop, 'handleDrop'),
  'Explorer.handleMouseEnter':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseEnter),
  'Explorer.handleMouseLeave':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseLeave),
  'Explorer.handlePaste':               Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handlePaste),
  'Explorer.handleWheel':               Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleWheel),
  'Explorer.newFile':                   Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFile),
  'Explorer.newFolder':                 Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFolder),
  'Explorer.openContainingFolder':      Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.openContainingFolder),
  'Explorer.removeDirent':              Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.removeDirent),
  'Explorer.renameDirent':              Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.renameDirent),
  'Explorer.revealItem':                Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.revealItem),
  'Explorer.scrollDown':                Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollDown),
  'Explorer.scrollUp':                  Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollUp),
  'Explorer.setDeltaY':                 Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.setDeltaY),
}

export * from './ViewletExplorer.js'
