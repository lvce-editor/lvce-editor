import { focusIndex } from './VirtualListFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusFirst = (state) => {
  const firstIndex = ListIndex.first()
  return focusIndex(state, firstIndex)
}
