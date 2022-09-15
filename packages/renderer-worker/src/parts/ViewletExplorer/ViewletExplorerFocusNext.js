import { focusIndex } from './ViewletExplorerFocusIndex.js'
import * as Arrays from '../Arrays/Arrays.js'

export const focusNext = (state) => {
  const { focusedIndex, dirents } = state
  if (focusedIndex === Arrays.lastIndex(dirents)) {
    return state
  }
  return focusIndex(state, focusedIndex + 1)
}
