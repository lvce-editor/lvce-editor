import { focusIndex } from './VirtualListFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusPrevious = (state) => {
  const { focusedIndex, items } = state
  if (focusedIndex === 0 || focusedIndex === -1) {
    return state
  }
  const previousIndex = ListIndex.previous(items, focusedIndex)
  return focusIndex(state, previousIndex)
}
