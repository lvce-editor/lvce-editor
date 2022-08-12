import * as ViewletStates from '../ViewletStates/ViewletStates.js'

// TODO should pass tab uri as argument or tab index
export const getMenuEntries = () => {
  const mainState = ViewletStates.getState('Main')
  const editor = mainState.editors[mainState.focusedIndex]
  const uri = editor.uri
  return [
    {
      id: 'tabClose',
      label: 'Close',
      flags: /* None */ 0,
      command: 'Main.closeFocusedTab',
    },
    {
      id: 'tabCloseOthers',
      label: 'Close Others',
      flags: /* None */ 0,
      command: 'Main.closeOthers',
    },
    {
      id: 'tabCloseToTheRight',
      label: 'Close to the Right',
      flags: /* None */ 0,
      command: 'Main.closeTabsToTheRight',
    },
    {
      id: 'tabCloseAll',
      label: 'Close All',
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
    {
      id: 'revealInExplorer',
      label: 'Reveal in Explorer',
      flags: /* None */ 0,
      command: 'Explorer.revealItem',
      args: [uri],
    },
  ]
}
