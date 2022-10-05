import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletMain from './ViewletMain.js'

// prettier-ignore
export const Commands = {
  'Main.closeActiveEditor': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.closeActiveEditor),
  'Main.closeAllEditors': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.closeAllEditors),
  'Main.closeEditor': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.closeEditor),
  'Main.closeFocusedTab': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.closeFocusedTab),
  'Main.closeOthers': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.closeOthers),
  'Main.closeTabsLeft': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.closeTabsLeft),
  'Main.closeTabsRight': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.closeTabsRight),
  'Main.focusFirst': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.focusFirst),
  'Main.focusLast': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.focusLast),
  'Main.focusNext': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.focusNext),
  'Main.focusPrevious': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.focusPrevious),
  'Main.handleDrop': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.handleDrop),
  'Main.handleTabClick': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.handleTabClick),
  'Main.handleTabContextMenu': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.handleTabContextMenu),
  'Main.openUri': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.openUri),
  'Main.save': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.save),
  // 'Main.hydrate': Viewlet.wrapViewletCommand(ViewletMain.name, ViewletMain.hydrate),
}

export * from './ViewletMain.js'
