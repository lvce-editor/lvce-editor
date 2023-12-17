import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './ViewletQuickPickFocusIndex.js'

export const focusPrevious = (state) => {
  const { items, focusedIndex } = state
  const previousIndex = ListIndex.previous(items, focusedIndex)
  return focusIndex(state, previousIndex)
}
