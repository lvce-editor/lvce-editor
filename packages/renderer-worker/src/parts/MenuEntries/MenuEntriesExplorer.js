import * as Command from '../Command/Command.js'

const ALL_ENTRIES = [
  {
    id: 'newFile',
    label: 'New File',
    flags: /* None */ 0,
    command: /* ViewletExplorer.newFile  */ 147,
  },
  {
    id: 'newFolder',
    label: 'New Folder',
    flags: /* None */ 0,
    command: /* ViewletExplorer.newFolder */ 152,
  },
  {
    id: 'openContainingFolder',
    label: 'Open Containing Folder',
    flags: /* None */ 0,
    command: /*  ViewletExplorer.openContainingFolder */ 148,
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
    command: /* ViewletExplorer.handleCopy */ 166,
  },
  {
    id: 'paste',
    label: 'Paste',
    flags: /* None */ 0,
    command: /* ViewletExplorer.handlePaste */ 165,
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
    command: /* ViewletExplorer.renameDirent */ 158,
  },
  {
    id: 'delete',
    label: 'Delete',
    flags: /* None */ 0,
    command: /* ViewletExplorer.removeDirent */ 151,
  },
]

const isFileEntry = (entry) => {
  return entry.id !== 'newFile' && entry.id !== 'newFolder'
}

export const getMenuEntries = async () => {
  // TODO explorer might already be disposed (race condition)
  const focusedDirent = await Command.execute(
    /* ViewletExplorer.getFocusedDirent */ 153
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
