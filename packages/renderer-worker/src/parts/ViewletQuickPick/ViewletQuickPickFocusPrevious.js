import { focusIndex } from './ViewletQuickPickFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusPrevious = (state) => {
  const { focusedIndex, items } = state
  const previousIndex = ListIndex.previous(items, focusedIndex)
  return focusIndex(state, previousIndex)
}
