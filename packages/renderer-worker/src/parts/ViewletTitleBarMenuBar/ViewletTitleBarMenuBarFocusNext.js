import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

const getIndexToFocusNextStartingAt = (items, index) => {
  return index % items.length
}

export const focusNext = (state) => {
  const { titleBarEntries, focusedIndex } = state
  const indexToFocus = getIndexToFocusNextStartingAt(
    titleBarEntries,
    focusedIndex + 1
  )
  return focusIndex(state, indexToFocus)
}
