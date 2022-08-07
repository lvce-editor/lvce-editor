import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletMain from './ViewletMain.js'

// prettier-ignore
export const Commands = {
  'Main.save': Viewlet.wrapViewletCommand('Main', ViewletMain.save),
  'Main.handleDrop': Viewlet.wrapViewletCommand('Main', ViewletMain.handleDrop),
  'Main.closeActiveEditor': Viewlet.wrapViewletCommand('Main', ViewletMain.closeActiveEditor),
  'Main.closeAllEditors': Viewlet.wrapViewletCommand('Main', ViewletMain.closeAllEditors),
  'Main.handleTabContextMenu': Viewlet.wrapViewletCommand('Main', ViewletMain.handleTabContextMenu),
  'Main.hydrate': Viewlet.wrapViewletCommand('Main', ViewletMain.hydrate),
  'Main.openUri': Viewlet.wrapViewletCommand('Main', ViewletMain.openUri),
  'Main.closeEditor': Viewlet.wrapViewletCommand('Main', ViewletMain.closeEditor),
  'Main.handleTabClick': Viewlet.wrapViewletCommand('Main', ViewletMain.handleTabClick),
  'Main.focusFirst': Viewlet.wrapViewletCommand('Main', ViewletMain.focusFirst),
  'Main.focusLast': Viewlet.wrapViewletCommand('Main', ViewletMain.focusLast),
  'Main.focusPrevious': Viewlet.wrapViewletCommand('Main', ViewletMain.focusPrevious),
  'Main.focusNext': Viewlet.wrapViewletCommand('Main', ViewletMain.focusNext),
  'Main.closeFocusedTab': Viewlet.wrapViewletCommand('Main', ViewletMain.closeFocusedTab),
  'Main.closeOthers': Viewlet.wrapViewletCommand('Main', ViewletMain.closeOthers),
  'Main.closeTabsRight': Viewlet.wrapViewletCommand('Main', ViewletMain.closeTabsRight),
  'Main.closeTabsLeft': Viewlet.wrapViewletCommand('Main', ViewletMain.closeTabsLeft),
}

export const Css = '/css/parts/Main.css'

export * from './ViewletMain.js'
