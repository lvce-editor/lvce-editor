import { focusIndex } from './ViewletQuickPickFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusNext = (state) => {
  const { focusedIndex, items } = state
  const nextIndex = ListIndex.next(focusedIndex, items)
  return focusIndex(state, nextIndex)
}
