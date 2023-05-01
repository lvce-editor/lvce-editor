import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Assert from '../Assert/Assert.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Close: 'Close',
  CloseOthers: 'Close Others',
  CloseToTheRight: 'Close To The Right',
  CloseAll: 'Close All',
  RevealInExplorer: 'Reveal in Explorer',
}

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
      label: I18nString.i18nString(UiStrings.Close),
      flags: MenuItemFlags.None,
      command: 'Main.closeFocusedTab',
    },
    {
      id: 'tabCloseOthers',
      label: I18nString.i18nString(UiStrings.CloseOthers),
      flags: MenuItemFlags.None,
      command: 'Main.closeOthers',
    },
    {
      id: 'tabCloseToTheRight',
      label: I18nString.i18nString(UiStrings.CloseToTheRight),
      flags: MenuItemFlags.None,
      command: 'Main.closeTabsRight',
    },
    {
      id: 'tabCloseAll',
      label: I18nString.i18nString(UiStrings.CloseAll),
      flags: MenuItemFlags.None,
      command: 'Main.closeAllEditors',
    },
    {
      id: 'revealInExplorer',
      label: I18nString.i18nString(UiStrings.RevealInExplorer),
      flags: MenuItemFlags.None,
      command: 'Explorer.revealItem',
      args: [uri],
    },
  ]
}
