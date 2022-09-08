import { focusIndex } from './ViewletActivityBarFocusIndex.js'

export const focusLast = (state) => {
  return focusIndex(state, state.activityBarItems.length - 1)
}
