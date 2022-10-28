import { openMenuAtIndex } from './ViewletTitleBarMenuBarOpenMenuAtIndex.js'

export const focusIndex = (state, index) => {
  const { isMenuOpen } = state
  if (isMenuOpen) {
    return openMenuAtIndex(state, index, /* focus */ false)
  }
  return {
    ...state,
    focusedIndex: index,
  }
}
