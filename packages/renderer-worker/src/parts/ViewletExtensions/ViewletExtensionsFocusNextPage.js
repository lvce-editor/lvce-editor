import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusNextPage = (state) => {
  if (state.focusedIndex === state.filteredExtensions.length - 1) {
    return state
  }
  const indexNextPage = Math.min(
    state.maxLineY + (state.maxLineY - state.minLineY) - 2,
    state.filteredExtensions.length - 1
  )
  return focusIndex(state, indexNextPage)
}
