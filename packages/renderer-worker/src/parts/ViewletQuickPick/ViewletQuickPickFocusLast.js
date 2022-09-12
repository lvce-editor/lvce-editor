import { focusIndex } from './ViewletQuickPickFocusIndex.js'

export const focusLast = (state) => {
  return focusIndex(state, state.items.length - 1)
}
