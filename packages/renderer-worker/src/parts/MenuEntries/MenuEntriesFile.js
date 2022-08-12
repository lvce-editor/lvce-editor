export const getMenuEntries = () => {
  return [
    {
      id: 'newFile',
      label: 'New File',
      flags: /* Disabled */ 5,
      command: /* TODO */ -1,
    },
    {
      id: 'newWindow',
      label: 'New Window',
      flags: /* None */ 0,
      command: /* Window.openNew */ 'Window.openNew',
    },
    {
      id: 'separator',
      label: 'Separator',
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'openFile',
      label: 'Open File',
      flags: /* Disabled */ 5,
      command: /* TODO */ -1,
    },
    {
      id: 'openFolder',
      label: 'Open Folder',
      flags: /* None */ 0,
      command: 'Dialog.openFolder',
    },
    {
      id: 'openRecent',
      label: 'Open Recent',
      flags: /* SubMenu */ 4,
      command: /* None */ 0,
    },
    {
      id: 'separator',
      label: 'Separator',
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'exit',
      label: 'Exit',
      flags: /* None */ 0,
      command: /* Window.exit */ 'Window.exit',
    },
  ]
}
