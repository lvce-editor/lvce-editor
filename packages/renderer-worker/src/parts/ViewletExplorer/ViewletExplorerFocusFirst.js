import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusFirst = (state) => {
  const { focusedIndex, dirents } = state
  if (dirents.length === 0 || focusedIndex === 0) {
    return state
  }
  return focusIndex(state, 0)
}
