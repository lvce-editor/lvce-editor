import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './VirtualListFocusIndex.js'

export const focusFirst = (state) => {
  const firstIndex = ListIndex.first()
  return focusIndex(state, firstIndex)
}
