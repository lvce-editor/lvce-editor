import { focusIndex } from './VirtualListFocusIndex.js'
import { focusLast } from './VirtualListFocusLast.js'

export const focusPrevious = (state) => {
  const { focusedIndex } = state
  if (focusedIndex === 0) {
    return focusLast(state)
  }
  return focusIndex(state, focusedIndex - 1)
}
