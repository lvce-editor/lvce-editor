import { focusIndex } from './ViewletQuickPickFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusNext = (state) => {
  const { items, focusedIndex } = state
  const nextIndex = ListIndex.next(items, focusedIndex)
  return focusIndex(state, nextIndex)
}
