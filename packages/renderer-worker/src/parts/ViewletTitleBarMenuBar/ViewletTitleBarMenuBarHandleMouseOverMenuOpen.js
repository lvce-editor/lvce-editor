import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

export const handleMouseOverMenuOpen = (state, index) => {
  if (index === -1) {
    return state
  }
  return focusIndex(state, index)
}
