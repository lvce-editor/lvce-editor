import * as Command from '../Command/Command.js'
import * as ViewletExplorer from './ViewletExplorer.js'
import * as Viewlet from './Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Explorer.focusNext', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusNext))
  Command.register('Explorer.focusPrevious', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusPrevious))
  Command.register('Explorer.scrollUp', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollUp))
  Command.register('Explorer.scrollDown', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollDown))
  Command.register('Explorer.handleClickCurrent', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClickCurrent))
  Command.register('Explorer.newFile', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFile))
  Command.register('Explorer.openContainingFolder', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.openContainingFolder))
  Command.register('Explorer.copyPath', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyPath))
  Command.register('Explorer.copyRelativePath', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyRelativePath))
  Command.register('Explorer.removeDirent', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.removeDirent))
  Command.register('Explorer.newFolder', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFolder))
  Command.register('Explorer.getFocusedDirent', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.getFocusedDirent))
  Command.register('Explorer.handleArrowRight', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowRight))
  Command.register('Explorer.handleArrowLeft', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowLeft))
  Command.register('Explorer.focusFirst', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusFirst))
  Command.register('Explorer.focusLast', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusLast))
  Command.register('Explorer.renameDirent', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.renameDirent))
  Command.register('Explorer.handleMouseEnter', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseEnter))
  Command.register('Explorer.handleMouseLeave', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseLeave))
  Command.register('Explorer.handleClick', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClick))
  Command.register('Explorer.handleContextMenu', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleContextMenu))
  Command.register('Explorer.handleWheel', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleWheel))
  Command.register('Explorer.setDeltaY', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.setDeltaY))
  Command.register('Explorer.handlePaste', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handlePaste))
  Command.register('Explorer.handleCopy', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleCopy))
  Command.register('Explorer.cancelRename', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelRename))
  Command.register('Explorer.acceptRename', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptRename))
  Command.register('Explorer.cancelNewFile', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelNewFile))
  Command.register('Explorer.acceptNewFile', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptNewFile))
  Command.register('Explorer.expandAll', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.expandAll))
  Command.register('Explorer.collapseAll', Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.collapseAll))
}
