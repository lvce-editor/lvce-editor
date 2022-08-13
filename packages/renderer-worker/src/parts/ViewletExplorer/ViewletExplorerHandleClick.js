import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'

export const handleClick = (state, index) => {
  if (index === -1) {
    return ViewletExplorerFocusIndex.focusIndex(state, -1)
  }
  const actualIndex = index + state.minLineY
  const dirent = state.dirents[actualIndex]
  if (!dirent) {
    console.warn(`[explorer] dirent at index ${actualIndex} not found`, state)
    return state
  }
  // TODO dirent type should be numeric
  switch (dirent.type) {
    case 'file':
      return handleClickFile(state, dirent, actualIndex)
    // TODO decide on one name
    case 'folder':
    case 'directory':
      return handleClickDirectory(state, dirent, actualIndex)
    case 'directory-expanding':
      return handleClickDirectoryExpanding(state, dirent, actualIndex)
    case 'directory-expanded':
      return handleClickDirectoryExpanded(state, dirent, actualIndex)
    default:
      break
  }
}
