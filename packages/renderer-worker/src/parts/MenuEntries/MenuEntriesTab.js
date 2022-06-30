// TODO should pass tab uri as argument or tab index
export const getMenuEntries = () => {
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
  ]
}
