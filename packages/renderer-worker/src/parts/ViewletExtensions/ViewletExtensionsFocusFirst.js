import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusFirst = (state) => {
  const { filteredExtensions } = state
  if (filteredExtensions.length === 0) {
    return state
  }
  return focusIndex(state, 0)
}
