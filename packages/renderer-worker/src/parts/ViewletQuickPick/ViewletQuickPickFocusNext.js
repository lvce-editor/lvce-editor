import { focusIndex } from './ViewletQuickPickFocusIndex.js'

export const focusNext = (state) => {
  const nextIndex = (state.focusedIndex + 1) % state.items.length
  return focusIndex(state, nextIndex)
}
