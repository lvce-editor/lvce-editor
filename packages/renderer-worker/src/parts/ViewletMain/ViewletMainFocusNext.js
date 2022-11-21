import { focusIndex } from './ViewletMainFocusIndex.js'

export const focusNext = (state) => {
  const { activeIndex, editors } = state
  const nextIndex = activeIndex === editors.length - 1 ? 0 : activeIndex + 1
  return focusIndex(state, nextIndex)
}
