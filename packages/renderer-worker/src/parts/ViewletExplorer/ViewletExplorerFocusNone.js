import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'

export const focusNone = (state) => {
  return ViewletExplorerFocusIndex.focusIndex(state, -1)
}
