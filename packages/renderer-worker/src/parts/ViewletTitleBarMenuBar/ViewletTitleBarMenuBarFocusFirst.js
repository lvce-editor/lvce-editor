import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

const getIndexToFocusNextStartingAt = (items, index) => {
  return index % items.length
}

export const focusFirst = (state) => {
  const { titleBarEntries } = state
  const indexToFocus = getIndexToFocusNextStartingAt(titleBarEntries, 0)
  return focusIndex(state, indexToFocus)
}
