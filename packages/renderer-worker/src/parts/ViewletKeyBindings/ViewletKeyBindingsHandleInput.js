import * as FilterKeyBindings from '../FilterKeyBindings/FilterKeyBindings.js'

export const handleInput = (state, value) => {
  const { parsedKeyBindings, maxVisibleItems } = state
  const filteredKeyBindings = FilterKeyBindings.getFilteredKeyBindings(parsedKeyBindings, value)
  const maxLineY = Math.min(filteredKeyBindings.length, maxVisibleItems)
  return {
    ...state,
    value,
    filteredKeyBindings,
    maxLineY,
  }
}
