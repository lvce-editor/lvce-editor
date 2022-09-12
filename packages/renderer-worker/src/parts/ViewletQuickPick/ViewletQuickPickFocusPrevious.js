import { focusIndex } from './ViewletQuickPickFocusIndex.js'

export const focusPrevious = (state) => {
  const previousIndex =
    state.focusedIndex === 0 ? state.items.length - 1 : state.focusedIndex - 1
  return focusIndex(state, previousIndex)
}
