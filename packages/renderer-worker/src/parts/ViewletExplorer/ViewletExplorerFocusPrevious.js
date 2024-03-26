import * as Arrays from '../Arrays/Arrays.js'
import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusPrevious = (state) => {
  const { focusedIndex, items } = state
  switch (focusedIndex) {
    case -1:
      if (items.length === 0) {
        return state
      }
      return focusIndex(state, Arrays.lastIndex(items))
    case 0:
      return state
    default:
      return focusIndex(state, focusedIndex - 1)
  }
}
