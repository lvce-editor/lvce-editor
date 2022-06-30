import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletMain from './ViewletMain.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Main.save', Viewlet.wrapViewletCommand('Main', ViewletMain.save))
  Command.register('Main.handleDrop', Viewlet.wrapViewletCommand('Main', ViewletMain.handleDrop))
  Command.register('Main.closeActiveEditor', Viewlet.wrapViewletCommand('Main', ViewletMain.closeActiveEditor))
  Command.register('Main.closeAllEditors', Viewlet.wrapViewletCommand('Main', ViewletMain.closeAllEditors))
  Command.register('Main.handleTabContextMenu', Viewlet.wrapViewletCommand('Main', ViewletMain.handleTabContextMenu))
  Command.register('Main.hydrate', Viewlet.wrapViewletCommand('Main', ViewletMain.hydrate))
  Command.register('Main.openUri', Viewlet.wrapViewletCommand('Main', ViewletMain.openUri))
  Command.register('Main.closeEditor', Viewlet.wrapViewletCommand('Main', ViewletMain.closeEditor))
  Command.register('Main.handleTabClick', Viewlet.wrapViewletCommand('Main', ViewletMain.handleTabClick))
  Command.register('Main.focusFirst', Viewlet.wrapViewletCommand('Main', ViewletMain.focusFirst))
  Command.register('Main.focusLast', Viewlet.wrapViewletCommand('Main', ViewletMain.focusLast))
  Command.register('Main.focusPrevious', Viewlet.wrapViewletCommand('Main', ViewletMain.focusPrevious))
  Command.register('Main.focusNext', Viewlet.wrapViewletCommand('Main', ViewletMain.focusNext))
  Command.register('Main.closeFocusedTab', Viewlet.wrapViewletCommand('Main', ViewletMain.closeFocusedTab))
  Command.register('Main.closeOthers', Viewlet.wrapViewletCommand('Main', ViewletMain.closeOthers))
  Command.register('Main.closeTabsRight', Viewlet.wrapViewletCommand('Main', ViewletMain.closeTabsRight))
  Command.register('Main.closeTabsLeft', Viewlet.wrapViewletCommand('Main', ViewletMain.closeTabsLeft))
}
