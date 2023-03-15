import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

export const handleMouseOverMenuClosed = (state, index) => {
  return focusIndex(state, index)
}
