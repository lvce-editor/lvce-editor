import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusNext = (state) => {
  if (state.focusedIndex === state.dirents.length - 1) {
    return state
  }
  return focusIndex(state, state.focusedIndex + 1)
}
