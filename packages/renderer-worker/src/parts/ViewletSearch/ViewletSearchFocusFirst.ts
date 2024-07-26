import * as ListIndex from '../ListIndex/ListIndex.js'
import * as ViewletSearchFocusIndex from './ViewletSearchFocusIndex.ts'

export const focusFirst = (state) => {
  const firstIndex = ListIndex.first()
  return ViewletSearchFocusIndex.focusIndex(state, firstIndex)
}
