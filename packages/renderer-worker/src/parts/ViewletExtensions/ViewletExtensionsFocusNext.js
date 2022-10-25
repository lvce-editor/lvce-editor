import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusNext = (state) => {
  const { filteredExtensions, focusedIndex } = state
  if (focusedIndex === filteredExtensions.length - 1) {
    return state
  }
  return focusIndex(state, focusedIndex + 1)
}
