import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusPreviousPage = (state) => {
  if (state.focusedIndex === 0 || state.focusedIndex === -1) {
    return state
  }

  const indexPreviousPage = Math.max(
    state.minLineY - (state.maxLineY - state.minLineY) + 1,
    0
  )
  return focusIndex(state, indexPreviousPage)
}
