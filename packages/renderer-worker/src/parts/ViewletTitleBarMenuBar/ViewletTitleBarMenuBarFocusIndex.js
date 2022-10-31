import { openMenuAtIndex } from './ViewletTitleBarMenuBarOpenMenuAtIndex.js'
import * as Assert from '../Assert/Assert.js'

export const focusIndex = (state, index) => {
  Assert.object(state)
  Assert.number(index)
  const { isMenuOpen } = state
  if (isMenuOpen) {
    return openMenuAtIndex(state, index, /* focus */ false)
  }
  return {
    ...state,
    focusedIndex: index,
  }
}
