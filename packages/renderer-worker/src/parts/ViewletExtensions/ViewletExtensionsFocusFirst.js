import { focusIndex } from './ViewletExtensionsFocusIndex.js'

export const focusFirst = (state) => {
  const { items } = state
  if (items.length === 0) {
    return state
  }
  return focusIndex(state, 0)
}
