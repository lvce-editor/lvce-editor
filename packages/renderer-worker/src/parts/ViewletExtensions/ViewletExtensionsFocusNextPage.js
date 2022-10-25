import { focusIndex } from './ViewletExtensionsFocusIndex.js'
import * as Arrays from '../Arrays/Arrays.js'

export const focusNextPage = (state) => {
  const { focusedIndex, filteredExtensions, maxLineY, minLineY } = state
  if (focusedIndex === Arrays.lastIndex(filteredExtensions)) {
    return state
  }
  const indexNextPage = Math.min(
    maxLineY + (maxLineY - minLineY) - 2,
    Arrays.lastIndex(filteredExtensions)
  )
  return focusIndex(state, indexNextPage)
}
