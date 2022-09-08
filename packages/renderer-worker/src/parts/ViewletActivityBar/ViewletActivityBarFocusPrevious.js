import { focusIndex } from './ViewletActivityBarFocusIndex.js'

export const focusPrevious = (state) => {
  if (state.focusedIndex === 0) {
    return state
  }
  return focusIndex(state, state.focusedIndex - 1)
}
