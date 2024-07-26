import * as ListIndex from '../ListIndex/ListIndex.js'
import * as ViewletSearchFocusIndex from './ViewletSearchFocusIndex.ts'

export const focusNext = (state) => {
  const { items, listFocusedIndex } = state
  const nextIndex = ListIndex.nextNoCycle(items, listFocusedIndex)
  return ViewletSearchFocusIndex.focusIndex(state, nextIndex)
}
