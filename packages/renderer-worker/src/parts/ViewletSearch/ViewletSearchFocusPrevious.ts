import * as ListIndex from '../ListIndex/ListIndex.js'
import * as ViewletSearchFocusIndex from './ViewletSearchFocusIndex.ts'

export const focusPrevious = (state) => {
  const { items, listFocusedIndex } = state
  const previousIndex = ListIndex.previousNoCycle(items, listFocusedIndex)
  return ViewletSearchFocusIndex.focusIndex(state, previousIndex)
}
