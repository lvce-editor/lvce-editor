import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusNext = (state) => {
  const { focusedIndex, dirents } = state
  if (focusedIndex === dirents.length - 1) {
    return state
  }
  return focusIndex(state, focusedIndex + 1)
}
