import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as I18nString from '../I18NString/I18NString.js'

const UiStrings = {
  Close: 'Close',
  CloseOthers: 'Close Others',
  CloseToTheRight: 'Close To The Right',
  CloseAll: 'Close All',
  RevealInExplorer: 'Reveal in Explorer',
}

// TODO should pass tab uri as argument or tab index
export const getMenuEntries = () => {
  const mainState = ViewletStates.getState('Main')
  const editor = mainState.editors[mainState.focusedIndex]
  const uri = editor.uri
  return [
    {
      id: 'tabClose',
      label: I18nString.i18nString(UiStrings.Close),
      flags: /* None */ 0,
      command: 'Main.closeFocusedTab',
    },
    {
      id: 'tabCloseOthers',
      label: I18nString.i18nString(UiStrings.CloseOthers),
      flags: /* None */ 0,
      command: 'Main.closeOthers',
    },
    {
      id: 'tabCloseToTheRight',
      label: I18nString.i18nString(UiStrings.CloseToTheRight),
      flags: /* None */ 0,
      command: 'Main.closeTabsToTheRight',
    },
    {
      id: 'tabCloseAll',
      label: I18nString.i18nString(UiStrings.CloseAll),
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
    {
      id: 'revealInExplorer',
      label: I18nString.i18nString(UiStrings.RevealInExplorer),
      flags: /* None */ 0,
      command: 'Explorer.revealItem',
      args: [uri],
    },
  ]
}
