import { focusPrevious } from './ViewletTitleBarMenuBarFocusPrevious.js'

export const handleKeyArrowLeftMenuOpen = (state) => {
  const { menus } = state
  if (menus.length > 1) {
    return closeOneMenu(state)
  }
  return focusPrevious(state)
}
