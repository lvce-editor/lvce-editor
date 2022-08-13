import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'

export const focusParentFolder = (state) => {
  const parentStartIndex = getParentStartIndex(
    state.dirents,
    state.focusedIndex
  )
  if (parentStartIndex === -1) {
    return state
  }
  return ViewletExplorerFocusIndex.focusIndex(state, parentStartIndex)
}
