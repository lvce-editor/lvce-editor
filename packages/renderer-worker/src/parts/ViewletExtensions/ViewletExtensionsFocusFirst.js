import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusFirst = (state) => {
  if (state.filteredExtensions.length === 0) {
    return state
  }
  return focusIndex(state, 0)
}
