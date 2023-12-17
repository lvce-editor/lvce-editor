import * as ListIndex from '../ListIndex/ListIndex.js'
import { focusIndex } from './ViewletQuickPickFocusIndex.js'

export const focusFirst = (state) => {
  return focusIndex(state, ListIndex.first())
}
