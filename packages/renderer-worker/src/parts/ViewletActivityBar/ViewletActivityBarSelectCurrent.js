import { handleClick } from './ViewletActivityBarHandleClick.js'

const getPosition = (state, index) => {
  const { activityBarItems, top, left, height, itemHeight } = state
  if (index > activityBarItems.length - 2) {
    // at bottom
    return {
      x: left,
      y: top + height - (activityBarItems.length - 1 - index) * itemHeight,
    }
  }
  // at top
  return {
    x: left,
    y: top + index * itemHeight,
  }
}

export const selectCurrent = async (state) => {
  if (state.focusedIndex === -1) {
    return
  }
  const position = getPosition(state, state.focusedIndex)
  await handleClick(state, state.focusedIndex, position.x, position.y)
}
