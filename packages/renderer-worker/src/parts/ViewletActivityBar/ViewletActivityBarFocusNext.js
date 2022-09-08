import { focusIndex } from './ViewletActivityBarFocusIndex.js'

export const focusNext = (state) => {
  // TODO can never be -1 -> always set when sidebar changes
  if (state.focusedIndex === state.activityBarItems.length - 1) {
    return state
  }
  return focusIndex(state, state.focusedIndex + 1)
}
