import { focusIndex } from './ViewletMainFocusIndex.js'

export const focusPrevious = (state) => {
  const { activeIndex, editors } = state
  const previousIndex = activeIndex === 0 ? editors.length - 1 : activeIndex - 1
  return focusIndex(state, previousIndex)
}
