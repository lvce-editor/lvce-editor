import { focusIndex } from './VirtualListFocusIndex.js'

export const focusPrevious = (state) => {
  const { focusedIndex } = state
  if (focusedIndex === 0 || focusedIndex === -1) {
    return state
  }
  return focusIndex(state, focusedIndex - 1)
}
