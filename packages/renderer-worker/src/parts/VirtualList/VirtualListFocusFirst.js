import { focusIndex } from './VirtualListFocusIndex.js'

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}
