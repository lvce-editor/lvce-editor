import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

export const focusNext = (state) => {
  const { titleBarEntries, focusedIndex } = state
  const indexToFocus = ListIndex.next(titleBarEntries, focusedIndex)
  return focusIndex(state, indexToFocus)
}
