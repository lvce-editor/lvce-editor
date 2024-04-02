import * as Assert from '../Assert/Assert.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletMainStrings from '../ViewletMain/ViewletMainStrings.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

// TODO should pass tab uri as argument or tab index
export const getMenuEntries = () => {
  const mainState = ViewletStates.getState(ViewletModuleId.Main)
  const activeGroupIndex = mainState.activeGroupIndex
  const groups = mainState.groups
  const group = groups[activeGroupIndex]
  const editors = group.editors
  const editor = editors[group.focusedIndex]
  Assert.object(editor)
  const uri = editor.uri
  return [
    {
      id: 'tabClose',
      label: ViewletMainStrings.close(),
      flags: MenuItemFlags.None,
      command: 'Main.closeFocusedTab',
    },
    {
      id: 'tabCloseOthers',
      label: ViewletMainStrings.closeOthers(),
      flags: MenuItemFlags.None,
      command: 'Main.closeOthers',
    },
    {
      id: 'tabCloseToTheRight',
      label: ViewletMainStrings.closeToTheRight(),
      flags: MenuItemFlags.None,
      command: 'Main.closeTabsRight',
    },
    {
      id: 'tabCloseAll',
      label: ViewletMainStrings.closeAll(),
      flags: MenuItemFlags.None,
      command: 'Main.closeAllEditors',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'revealInExplorer',
      label: ViewletMainStrings.revealInExplorer(),
      flags: MenuItemFlags.None,
      command: 'Explorer.revealItem',
      args: [uri],
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'findFileReferences',
      label: ViewletMainStrings.findFileReferences(),
      flags: MenuItemFlags.None,
      command: 'SideBar.show',
      args: [/* id */ 'References', /* focus */ true, uri],
    },
  ]
}
