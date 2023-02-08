import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusNext = (state) => {
  const { titleBarEntries, focusedIndex } = state
  const indexToFocus = ListIndex.next(titleBarEntries, focusedIndex)
  return focusIndex(state, indexToFocus)
}
