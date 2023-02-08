import { focusIndex } from './VirtualListFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusLast = (state) => {
  const { items } = state
  const lastIndex = ListIndex.last(items)
  return focusIndex(state, lastIndex)
}
