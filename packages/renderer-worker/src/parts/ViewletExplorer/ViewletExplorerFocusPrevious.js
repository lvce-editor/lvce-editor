import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusPrevious = (state) => {
  const { focusedIndex, dirents } = state
  switch (focusedIndex) {
    case -1:
      if (dirents.length === 0) {
        return state
      }
      return focusIndex(state, dirents.length - 1)
    case 0:
      return state
    default:
      return focusIndex(state, focusedIndex - 1)
  }
}
