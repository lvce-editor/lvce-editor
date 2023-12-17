import * as ListIndex from '../ListIndex/ListIndex.js'
import * as ViewletSearchFocusIndex from './ViewletSearchFocusIndex.js'

export const focusFirst = (state) => {
  const firstIndex = ListIndex.first()
  return ViewletSearchFocusIndex.focusIndex(state, firstIndex)
}
