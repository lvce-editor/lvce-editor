import { focusIndex } from './VirtualListFocusIndex.js'

export const focusLast = (state) => {
  const { items } = state
  return focusIndex(state, items.length - 1)
}
