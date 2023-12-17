import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './VirtualListFocusIndex.js'

export const focusLast = (state) => {
  const { items } = state
  const lastIndex = ListIndex.last(items)
  return focusIndex(state, lastIndex)
}
