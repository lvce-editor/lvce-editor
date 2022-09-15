import { focusIndex } from './ViewletExtensionsFocusIndex.js'
import * as Arrays from '../Arrays/Arrays.js'

export const focusNextPage = (state) => {
  if (state.focusedIndex === Arrays.lastIndex(state.filteredExtensions)) {
    return state
  }
  const indexNextPage = Math.min(
    state.maxLineY + (state.maxLineY - state.minLineY) - 2,
    Arrays.lastIndex(state.filteredExtensions)
  )
  return focusIndex(state, indexNextPage)
}
