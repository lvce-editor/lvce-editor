import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

const getIndexToFocusPreviousStartingAt = (items, index) => {
  return (index + items.length) % items.length
}

export const focusPrevious = (state) => {
  const { titleBarEntries, focusedIndex } = state
  const indexToFocus = getIndexToFocusPreviousStartingAt(
    titleBarEntries,
    focusedIndex - 1
  )
  return focusIndex(state, indexToFocus)
}
