import * as Arrays from '../Arrays/Arrays.js'
import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusNext = (state) => {
  const { focusedIndex, items } = state
  if (focusedIndex === Arrays.lastIndex(items)) {
    return state
  }
  return focusIndex(state, focusedIndex + 1)
}
