import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'

export const focusPrevious = (state) => {
  switch (state.focusedIndex) {
    case -1:
      if (state.dirents.length === 0) {
        return state
      }
      return ViewletExplorerFocusIndex.focusIndex(
        state,
        state.dirents.length - 1
      )
    case 0:
      return state
    default:
      return ViewletExplorerFocusIndex.focusIndex(state, state.focusedIndex - 1)
  }
}
