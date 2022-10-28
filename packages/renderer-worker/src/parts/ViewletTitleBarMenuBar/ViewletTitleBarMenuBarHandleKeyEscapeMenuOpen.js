import { closeMenu } from './ViewletTitleBarMenuBarCloseMenu.js'
import { closeOneMenu } from './ViewletTitleBarMenuBarCloseOneMenu.js'

export const handleKeyEscapeMenuOpen = (state) => {
  const { menus } = state
  if (menus.length > 1) {
    return closeOneMenu(state)
  }
  return closeMenu(state, /* keepFocus */ true)
}
