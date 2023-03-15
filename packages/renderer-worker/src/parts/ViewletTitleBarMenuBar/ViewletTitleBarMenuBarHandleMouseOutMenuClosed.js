import { focusIndex } from './ViewletTitleBarMenuBarFocusIndex.js'

export const handleMouseOutMenuClosed = (state) => {
  return focusIndex(state, -1)
}
