import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

const getIndexToFocusPreviousStartingAt = (items, index) => {
  return (index + items.length) % items.length
}

export const focusLast = (state) => {
  const { titleBarEntries } = state
  const indexToFocus = getIndexToFocusPreviousStartingAt(
    titleBarEntries,
    titleBarEntries.length - 1
  )
  return focusIndex(state, indexToFocus)
}
