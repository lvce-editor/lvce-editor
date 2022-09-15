import { focusIndex } from './ViewletActivityBarFocusIndex.js'
import * as Arrays from '../Arrays/Arrays.js'

export const focusLast = (state) => {
  return focusIndex(state, Arrays.lastIndex(state.activityBarItems))
}
