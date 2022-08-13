import * as ViewletExplorerFocusParentFolder from './ViewletExplorerFocusParentFolder.js'

export const handleArrowLeft = (state) => {
  if (state.focusedIndex === -1) {
    return state
  }
  const dirent = state.dirents[state.focusedIndex]
  switch (dirent.type) {
    case 'directory':
    case 'file':
      return ViewletExplorerFocusParentFolder.focusParentFolder(state)
    case 'directory-expanded':
      return handleClickDirectoryExpanded(state, dirent, state.focusedIndex)
    default:
      // TODO handle expanding directory and cancel file system call to read child dirents
      break
  }
}
