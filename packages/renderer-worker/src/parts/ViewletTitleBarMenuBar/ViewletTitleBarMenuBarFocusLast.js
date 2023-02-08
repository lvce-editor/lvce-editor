import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusLast = (state) => {
  const { titleBarEntries } = state
  const indexToFocus = ListIndex.last(titleBarEntries)
  return focusIndex(state, indexToFocus)
}
