import * as Command from '../Command/Command.js'

const ALL_ENTRIES = [
  {
    id: 'newFile',
    label: 'New File',
    flags: /* None */ 0,
    command: /* Explorer.newFile  */ 'Explorer.newFile',
  },
  {
    id: 'newFolder',
    label: 'New Folder',
    flags: /* None */ 0,
    command: /* Explorer.newFolder */ 'Explorer.newFolder',
  },
  {
    id: 'openContainingFolder',
    label: 'Open Containing Folder',
    flags: /* None */ 0,
    command:
      /*  Explorer.openContainingFolder */ 'Explorer.openContainingFolder',
  },
  {
    id: 'openInIntegratedTerminal',
    label: 'Open in integrated Terminal',
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: '',
    label: '',
    flags: /* Separator */ 1,
    command: /* None */ 0,
  },
  {
    id: 'cut',
    label: 'Cut',
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: 'copy',
    label: 'Copy',
    flags: /* None */ 0,
    command: /* Explorer.handleCopy */ 'Explorer.handleCopy',
  },
  {
    id: 'paste',
    label: 'Paste',
    flags: /* None */ 0,
    command: /* Explorer.handlePaste */ 'Explorer.handlePaste',
  },
  {
    id: '',
    label: '',
    flags: /* Separator */ 1,
    command: /* None */ 0,
  },
  {
    id: 'copyPath',
    label: 'Copy Path',
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: 'copyRelativePath',
    label: 'Copy Relative Path',
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: '',
    label: '',
    flags: /* Separator */ 1,
    command: /* None */ 0,
  },
  {
    id: 'rename',
    label: 'Rename',
    flags: /* None */ 0,
    command: /* Explorer.renameDirent */ 'Explorer.renameDirent',
  },
  {
    id: 'delete',
    label: 'Delete',
    flags: /* None */ 0,
    command: /* Explorer.removeDirent */ 'Explorer.removeDirent',
  },
]

const isFileEntry = (entry) => {
  return entry.id !== 'newFile' && entry.id !== 'newFolder'
}

export const getMenuEntries = async () => {
  // TODO need a way to access state of other components synchronously
  // TODO explorer might already be disposed (race condition)
  const focusedDirent = await Command.execute(
    /* Explorer.getFocusedDirent */ 'Explorer.getFocusedDirent'
  )
  if (!focusedDirent) {
    return ALL_ENTRIES
  }
  switch (focusedDirent.type) {
    case 'directory':
      return ALL_ENTRIES
    case 'file':
      return ALL_ENTRIES.filter(isFileEntry)
    default:
      return ALL_ENTRIES
  }
}
