import { focusIndex } from './ViewletQuickPickFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusLast = (state) => {
  const { items } = state
  return focusIndex(state, ListIndex.last(items))
}
