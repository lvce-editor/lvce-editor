import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusPreviousPage = (state) => {
  const { focusedIndex, minLineY, maxLineY } = state
  if (focusedIndex === 0 || focusedIndex === -1) {
    return state
  }

  const indexPreviousPage = Math.max(minLineY - (maxLineY - minLineY) + 1, 0)
  return focusIndex(state, indexPreviousPage)
}
