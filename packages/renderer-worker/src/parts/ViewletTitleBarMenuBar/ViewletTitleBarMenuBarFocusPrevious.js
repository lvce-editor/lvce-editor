import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

export const focusPrevious = (state) => {
  const { titleBarEntries, focusedIndex } = state
  const indexToFocus = ListIndex.previous(titleBarEntries, focusedIndex)
  return focusIndex(state, indexToFocus)
}
