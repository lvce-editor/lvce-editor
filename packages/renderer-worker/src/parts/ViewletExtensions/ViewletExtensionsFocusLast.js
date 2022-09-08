import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusLast = (state) => {
  if (state.filteredExtensions.length === 0) {
    return state
  }
  return focusIndex(state, state.filteredExtensions.length - 1)
}
