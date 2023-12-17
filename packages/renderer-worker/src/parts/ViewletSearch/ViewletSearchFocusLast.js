import * as ListIndex from '../ListIndex/ListIndex.js'
import * as ViewletSearchFocusIndex from './ViewletSearchFocusIndex.js'

export const focusLast = (state) => {
  const { items } = state
  const lastIndex = ListIndex.last(items)
  return ViewletSearchFocusIndex.focusIndex(state, lastIndex)
}
