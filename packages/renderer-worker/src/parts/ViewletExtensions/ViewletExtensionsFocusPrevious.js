import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusPrevious = (state) => {
  if (state.focusedIndex === 0 || state.focusedIndex === -1) {
    return state
  }
  return focusIndex(state, state.focusedIndex - 1)
}
