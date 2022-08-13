import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'

export const focusLast = (state) => {
  if (
    state.dirents.length === 0 ||
    state.focusedIndex === state.dirents.length - 1
  ) {
    return state
  }
  return ViewletExplorerFocusIndex.focusIndex(state, state.dirents.length - 1)
}
