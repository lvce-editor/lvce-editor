import { focusPrevious } from './ViewletTitleBarMenuBarFocusPrevious.js'

export const handleKeyArrowLeftMenuClosed = (state) => {
  // TODO menu collapse
  return focusPrevious(state)
}
