import * as Arrays from '../Arrays/Arrays.js'
import { focusIndex } from './VirtualListFocusIndex.js'

export const focusNextPage = (state) => {
  const { focusedIndex, items, maxLineY, minLineY } = state
  if (Arrays.isLastIndex(items, focusedIndex)) {
    return state
  }
  const indexNextPage = Math.min(maxLineY + (maxLineY - minLineY) - 2, Arrays.lastIndex(items))
  return focusIndex(state, indexNextPage)
}
