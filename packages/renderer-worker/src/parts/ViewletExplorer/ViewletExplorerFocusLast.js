import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusLast = (state) => {
  const { focusedIndex, dirents } = state
  if (dirents.length === 0 || focusedIndex === dirents.length - 1) {
    return state
  }
  return focusIndex(state, dirents.length - 1)
}
