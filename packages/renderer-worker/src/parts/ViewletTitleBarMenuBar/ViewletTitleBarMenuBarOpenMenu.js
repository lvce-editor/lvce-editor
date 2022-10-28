import { openMenuAtIndex } from './ViewletTitleBarMenuBarOpenMenuAtIndex.js'

/**
 * @param {boolean} focus
 */
export const openMenu = (state, focus) => {
  const { focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  return openMenuAtIndex(state, focusedIndex, focus)
}
