import { closeMenu } from './ViewletTitleBarMenuBarCloseMenu.js'
import { openMenu } from './ViewletTitleBarMenuBarOpenMenu.js'

export const toggleMenu = (state) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    return closeMenu(state, /* keepFocus */ true)
  }
  return openMenu(state, /* focus */ false)
}
