import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletMain from './ViewletMain.js'

export const __initialize__ = () => {
  Command.register(89, Viewlet.wrapViewletCommand('Main', ViewletMain.save))
  Command.register(92, Viewlet.wrapViewletCommand('Main', ViewletMain.handleDrop))
  Command.register(93, Viewlet.wrapViewletCommand('Main', ViewletMain.closeActiveEditor))
  Command.register(94, Viewlet.wrapViewletCommand('Main', ViewletMain.closeAllEditors))
  Command.register(95, Viewlet.wrapViewletCommand('Main', ViewletMain.handleTabContextMenu))
  Command.register(96, Viewlet.wrapViewletCommand('Main', ViewletMain.hydrate))
  Command.register(97, Viewlet.wrapViewletCommand('Main', ViewletMain.openUri))
  Command.register(99, Viewlet.wrapViewletCommand('Main', ViewletMain.closeEditor))
  Command.register(100, Viewlet.wrapViewletCommand('Main', ViewletMain.handleTabClick))
  Command.register(101, Viewlet.wrapViewletCommand('Main', ViewletMain.focusFirst))
  Command.register(102, Viewlet.wrapViewletCommand('Main', ViewletMain.focusLast))
  Command.register(103, Viewlet.wrapViewletCommand('Main', ViewletMain.focusPrevious))
  Command.register(104, Viewlet.wrapViewletCommand('Main', ViewletMain.focusNext))
  Command.register(105, Viewlet.wrapViewletCommand('Main', ViewletMain.closeFocusedTab))
  Command.register(106, Viewlet.wrapViewletCommand('Main', ViewletMain.closeOthers))
  Command.register(107, Viewlet.wrapViewletCommand('Main', ViewletMain.closeTabsRight))
  Command.register(108, Viewlet.wrapViewletCommand('Main', ViewletMain.closeTabsLeft))
}
