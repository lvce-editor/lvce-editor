import { focusIndex } from './ViewletExplorerFocusIndex.js'

export const focusNone = (state) => {
  return focusIndex(state, -1)
}
