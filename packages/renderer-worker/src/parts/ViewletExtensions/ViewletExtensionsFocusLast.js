import { focusIndex } from './ViewletExtensionsFocusIndex.js'
import * as Arrays from '../Arrays/Arrays.js'

export const focusLast = (state) => {
  if (state.filteredExtensions.length === 0) {
    return state
  }
  return focusIndex(state, Arrays.lastIndex(state.filteredExtensions))
}
