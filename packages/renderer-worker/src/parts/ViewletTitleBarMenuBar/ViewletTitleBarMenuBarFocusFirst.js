import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

export const focusFirst = (state) => {
  const indexToFocus = ListIndex.first()
  return focusIndex(state, indexToFocus)
}
