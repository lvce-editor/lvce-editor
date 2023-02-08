import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './VirtualListFocusIndex.js'

export const focusNext = (state) => {
  const { focusedIndex, items } = state
  const nextIndex = ListIndex.next(items, focusedIndex)
  return focusIndex(state, nextIndex)
}
