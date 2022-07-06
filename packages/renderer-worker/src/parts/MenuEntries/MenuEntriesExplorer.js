import * as Viewlet from '../Viewlet/Viewlet.js'

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

// TODO there are two possible ways of getting the focused dirent of explorer
// 1. directly access state of explorer (bad because it directly accesses state of another component)
// 2. expose getFocusedDirent method in explorer (bad because explorer code should not know about for menuEntriesExplorer, which needs that method)
const getFocusedDirent = () => {
  const explorerState = Viewlet.getState('Explorer')
  if (!explorerState || explorerState.focusedIndex < 0) {
    return undefined
  }
  return explorerState.dirents[explorerState.focusedIndex]
}

export const getMenuEntries = () => {
  const focusedDirent = getFocusedDirent()
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
