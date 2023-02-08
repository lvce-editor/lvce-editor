import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusFirst = (state) => {
  const indexToFocus = ListIndex.first()
  return focusIndex(state, indexToFocus)
}
