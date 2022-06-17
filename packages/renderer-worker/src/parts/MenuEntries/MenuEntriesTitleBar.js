import * as Platform from '../Platform/Platform.js'

export const getMenuEntries = () => {
  if (Platform.getPlatform() === 'web') {
    return [
      {
        id: 'file',
        name: 'File',
        flags: /* None */ 0,
      },
      {
        id: 'edit',
        name: 'Edit',
        flags: /* None */ 0,
      },
      {
        id: 'selection',
        name: 'Selection',
        flags: /* None */ 0,
      },
      {
        id: 'view',
        name: 'View',
        flags: /* None */ 0,
      },
      {
        id: 'go',
        name: 'Go',
        flags: /* None */ 0,
      },
    ]
  }
  return [
    {
      id: 'file',
      name: 'File',
      flags: /* None */ 0,
    },
    {
      id: 'edit',
      name: 'Edit',
      flags: /* None */ 0,
    },
    {
      id: 'selection',
      name: 'Selection',
      flags: /* None */ 0,
    },
    {
      id: 'view',
      name: 'View',
      flags: /* None */ 0,
    },
    {
      id: 'go',
      name: 'Go',
      flags: /* None */ 0,
    },
    {
      id: 'run',
      name: 'Run',
      keyboardShortCut: 'Alt+r',
      flags: /* None */ 0,
    },
    {
      id: 'terminal',
      name: 'Terminal',
      keyboardShortCut: 'Alt+t',
      flags: /* None */ 0,
    },
    {
      id: 'help',
      name: 'Help',
      keyboardShortCut: 'Alt+h',
      flags: /* None */ 0,
    },
  ]
}
