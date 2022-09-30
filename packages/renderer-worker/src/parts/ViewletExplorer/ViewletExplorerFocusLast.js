import { focusIndex } from './ViewletExplorerFocusIndex.js'
import * as Arrays from '../Arrays/Arrays.js'

export const focusLast = (state) => {
  const { focusedIndex, items } = state
  const lastIndex = Arrays.lastIndex(items)
  if (items.length === 0 || focusedIndex === lastIndex) {
    return state
  }
  return focusIndex(state, lastIndex)
}
