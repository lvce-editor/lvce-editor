import { focusIndex } from './ViewletActivityBarFocusIndex.js'

export const focus = (state) => {
  const indexToFocus = state.focusedIndex === -1 ? 0 : state.focusedIndex
  return focusIndex(state, indexToFocus)
}
