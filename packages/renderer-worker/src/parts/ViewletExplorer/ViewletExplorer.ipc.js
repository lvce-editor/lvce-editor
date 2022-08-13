import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletExplorer from './ViewletExplorer.js'

// prettier-ignore
export const Commands = {
  'Explorer.acceptNewFile':        Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptNewFile),
  'Explorer.acceptRename':         Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptRename),
  'Explorer.cancelNewFile':        Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelNewFile),
  'Explorer.cancelRename':         Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelRename),
  'Explorer.collapseAll':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.collapseAll),
  'Explorer.copyPath':             Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyPath),
  'Explorer.copyRelativePath':     Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyRelativePath),
  'Explorer.expandAll':            Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.expandAll),
  'Explorer.focus':                Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focus),
  'Explorer.focusFirst':           Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusFirst),
  'Explorer.focusIndex':           Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusIndex),
  'Explorer.focusLast':            Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusLast),
  'Explorer.focusNext':            Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusNext),
  'Explorer.focusNone':            Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusNone),
  'Explorer.focusPrevious':        Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusPrevious),
  'Explorer.getFocusedDirent':     Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.getFocusedDirent),
  'Explorer.handleArrowLeft':      Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowLeft),
  'Explorer.handleArrowRight':     Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowRight),
  'Explorer.handleBlur':           Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleBlur),
  'Explorer.handleClick':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClick),
  'Explorer.handleClickCurrent':   Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClickCurrent),
  'Explorer.handleContextMenu':    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleContextMenu),
  'Explorer.handleCopy':           Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleCopy),
  'Explorer.handleMouseEnter':     Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseEnter),
  'Explorer.handleMouseLeave':     Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseLeave),
  'Explorer.handlePaste':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handlePaste),
  'Explorer.handleWheel':          Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleWheel),
  'Explorer.newFile':              Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFile),
  'Explorer.newFolder':            Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFolder),
  'Explorer.openContainingFolder': Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.openContainingFolder),
  'Explorer.removeDirent':         Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.removeDirent),
  'Explorer.renameDirent':         Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.renameDirent),
  'Explorer.revealItem':           Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.revealItem),
  'Explorer.scrollDown':           Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollDown),
  'Explorer.scrollUp':             Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollUp),
  'Explorer.setDeltaY':            Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.setDeltaY),
}

export * from './ViewletExplorer.js'
