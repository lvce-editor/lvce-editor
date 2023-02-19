import * as ViewletSearchFocusIndex from './ViewletSearchFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusFirst = (state) => {
  const firstIndex = ListIndex.first()
  return ViewletSearchFocusIndex.focusIndex(state, firstIndex)
}
