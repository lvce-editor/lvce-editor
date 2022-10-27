import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusNext = (state) => {
  const { items, focusedIndex } = state
  if (focusedIndex === items.length - 1) {
    return state
  }
  return focusIndex(state, focusedIndex + 1)
}
