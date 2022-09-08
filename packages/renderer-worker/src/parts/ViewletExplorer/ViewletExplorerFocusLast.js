import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusLast = (state) => {
  if (
    state.dirents.length === 0 ||
    state.focusedIndex === state.dirents.length - 1
  ) {
    return state
  }
  return focusIndex(state, state.dirents.length - 1)
}
