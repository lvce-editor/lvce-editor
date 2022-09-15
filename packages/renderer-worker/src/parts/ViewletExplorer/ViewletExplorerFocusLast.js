import { focusIndex } from './ViewletExplorerFocusIndex.js'
import * as Arrays from '../Arrays/Arrays.js'

export const focusLast = (state) => {
  const { focusedIndex, dirents } = state
  const lastIndex = Arrays.lastIndex(dirents)
  if (dirents.length === 0 || focusedIndex === lastIndex) {
    return state
  }
  return focusIndex(state, lastIndex)
}
