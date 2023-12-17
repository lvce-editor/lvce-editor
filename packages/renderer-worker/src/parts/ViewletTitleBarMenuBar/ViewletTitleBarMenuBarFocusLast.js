import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

export const focusLast = (state) => {
  const { titleBarEntries } = state
  const indexToFocus = ListIndex.last(titleBarEntries)
  return focusIndex(state, indexToFocus)
}
