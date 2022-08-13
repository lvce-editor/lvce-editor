import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'

export const focusFirst = (state) => {
  if (state.dirents.length === 0 || state.focusedIndex === 0) {
    return state
  }
  return ViewletExplorerFocusIndex.focusIndex(state, 0)
}
