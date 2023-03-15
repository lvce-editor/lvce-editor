import * as ViewletSearchFocusIndex from './ViewletSearchFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusNext = (state) => {
  const { items, listFocusedIndex } = state
  const nextIndex = ListIndex.nextNoCycle(items, listFocusedIndex)
  return ViewletSearchFocusIndex.focusIndex(state, nextIndex)
}
