// TODO should pass tab uri as argument or tab index
export const getMenuEntries = () => {
  return [
    {
      id: 'tabClose',
      label: 'Close',
      flags: /* None */ 0,
      command: /* Main.closeFocusedTab */ 105,
    },
    {
      id: 'tabCloseOthers',
      label: 'Close Others',
      flags: /* None */ 0,
      command: /* Main.closeOthers */ 106,
    },
    {
      id: 'tabCloseToTheRight',
      label: 'Close to the Right',
      flags: /* None */ 0,
      command: /* Main.closeTabsToTheRight */ 107,
    },
    {
      id: 'tabCloseAll',
      label: 'Close All',
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
  ]
}
