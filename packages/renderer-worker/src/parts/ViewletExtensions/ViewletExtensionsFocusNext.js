import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusNext = (state) => {
  if (state.focusedIndex === state.filteredExtensions.length - 1) {
    return state
  }
  return focusIndex(state, state.focusedIndex + 1)
}
