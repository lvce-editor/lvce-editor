import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './ViewletQuickPickFocusIndex.js'

export const focusLast = (state) => {
  const { items } = state
  return focusIndex(state, ListIndex.last(items))
}
