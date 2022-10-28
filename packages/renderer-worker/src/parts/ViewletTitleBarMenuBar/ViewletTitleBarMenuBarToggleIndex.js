import { closeMenu } from './ViewletTitleBarMenuBarCloseMenu.js'
import { openMenuAtIndex } from './ViewletTitleBarMenuBarOpenMenuAtIndex.js'

export const toggleIndex = (state, index) => {
  const { isMenuOpen, focusedIndex } = state
  if (isMenuOpen && focusedIndex === index) {
    return closeMenu(state, /* keepFocus */ true)
  }
  return openMenuAtIndex(state, index, /* focus */ false)
}
