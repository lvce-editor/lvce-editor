import { handleClick } from './ViewletActivityBarHandleClick.js'

const getPosition = (state, index) => {
  const { activityBarItems, x, y, height, itemHeight } = state
  if (index > activityBarItems.length - 2) {
    // at bottom
    return {
      x,
      y: y + height - (activityBarItems.length - 1 - index) * itemHeight,
    }
  }
  // at top
  return {
    x,
    y: y + index * itemHeight,
  }
}

export const selectCurrent = (state) => {
  if (state.focusedIndex === -1) {
    return
  }
  const position = getPosition(state, state.focusedIndex)
  return handleClick(state, state.focusedIndex, position.x, position.y)
}
