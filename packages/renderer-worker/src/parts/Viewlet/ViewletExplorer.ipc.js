import * as Command from '../Command/Command.js'
import * as ViewletExplorer from './ViewletExplorer.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(
    'ViewletExplorer.focusNext',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusNext)
  )
  Command.register(
    'ViewletExplorer.focusPrevious',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusPrevious)
  )
  Command.register(
    'ViewletExplorer.scrollUp',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollUp)
  )
  Command.register(
    'ViewletExplorer.scrollDown',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.scrollDown)
  )
  Command.register(
    'ViewletExplorer.handleClickCurrent',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClickCurrent)
  )
  Command.register(
    'ViewletExplorer.newFile',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFile)
  )
  Command.register(
    'ViewletExplorer.openContainingFolder',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.openContainingFolder)
  )
  Command.register(
    'ViewletExplorer.copyPath',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyPath)
  )
  Command.register(
    'ViewletExplorer.copyRelativePath',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.copyRelativePath)
  )
  Command.register(
    'ViewletExplorer.removeDirent',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.removeDirent)
  )
  Command.register(
    'ViewletExplorer.newFolder',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.newFolder)
  )
  Command.register(
    'ViewletExplorer.getFocusedDirent',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.getFocusedDirent)
  )
  Command.register(
    'ViewletExplorer.handleArrowRight',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowRight)
  )
  Command.register(
    'ViewletExplorer.handleArrowLeft',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleArrowLeft)
  )
  Command.register(
    'ViewletExplorer.focusFirst',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusFirst)
  )
  Command.register(
    'ViewletExplorer.focusLast',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.focusLast)
  )
  Command.register(
    'ViewletExplorer.renameDirent',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.renameDirent)
  )
  Command.register(
    'ViewletExplorer.handleMouseEnter',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseEnter)
  )
  Command.register(
    'ViewletExplorer.handleMouseLeave',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleMouseLeave)
  )
  Command.register(
    'ViewletExplorer.handleClick',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleClick)
  )
  Command.register(
    'ViewletExplorer.handleContextMenu',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleContextMenu)
  )
  Command.register(
    'ViewletExplorer.handleWheel',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleWheel)
  )
  Command.register(
    'ViewletExplorer.setDeltaY',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.setDeltaY)
  )
  Command.register(
    'ViewletExplorer.handlePaste',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handlePaste)
  )
  Command.register(
    'ViewletExplorer.handleCopy',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.handleCopy)
  )
  Command.register(
    'ViewletExplorer.cancelRename',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelRename)
  )
  Command.register(
    'ViewletExplorer.acceptRename',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptRename)
  )
  Command.register(
    'ViewletExplorer.cancelNewFile',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.cancelNewFile)
  )
  Command.register(
    'ViewletExplorer.acceptNewFile',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.acceptNewFile)
  )
  Command.register(
    'ViewletExplorer.expandAll',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.expandAll)
  )
  Command.register(
    'ViewletExplorer.collapseAll',
    Viewlet.wrapViewletCommand('Explorer', ViewletExplorer.collapseAll)
  )
}
