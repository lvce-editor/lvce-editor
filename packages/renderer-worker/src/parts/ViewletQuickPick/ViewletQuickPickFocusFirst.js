import { focusIndex } from './ViewletQuickPickFocusIndex.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const focusFirst = (state) => {
  return focusIndex(state, ListIndex.first())
}
