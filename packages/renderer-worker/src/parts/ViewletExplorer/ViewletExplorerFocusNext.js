import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'

export const focusNext = (state) => {
  if (state.focusedIndex === state.dirents.length - 1) {
    return state
  }
  return ViewletExplorerFocusIndex.focusIndex(state, state.focusedIndex + 1)
}
