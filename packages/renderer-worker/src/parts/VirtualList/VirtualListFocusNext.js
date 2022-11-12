import { focusFirst } from './VirtualListFocusFirst.js'
import { focusIndex } from './VirtualListFocusIndex.js'

export const focusNext = (state) => {
  const { focusedIndex, items } = state
  if (focusedIndex === items.length - 1) {
    return focusFirst(state)
  }
  return focusIndex(state, focusedIndex + 1)
}
