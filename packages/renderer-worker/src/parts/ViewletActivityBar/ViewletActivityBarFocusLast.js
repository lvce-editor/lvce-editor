import * as Arrays from '../Arrays/Arrays.js'
import { focusIndex } from './ViewletActivityBarFocusIndex.js'

export const focusLast = (state) => {
  return focusIndex(state, Arrays.lastIndex(state.activityBarItems))
}
