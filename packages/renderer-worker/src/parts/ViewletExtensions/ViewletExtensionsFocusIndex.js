import { getListHeight } from './ViewletExtensionsShared.js'

export const focusIndex = (state, index) => {
  const { itemHeight } = state
  if (index === -1) {
    return {
      ...state,
      focusedIndex: -1,
    }
  }
  const listHeight = getListHeight(state)
  if (index < state.minLineY + 1) {
    // scroll up
    const minLineY = index
    const maxLineY = minLineY + Math.ceil(listHeight / itemHeight)
    const negativeMargin = -minLineY * itemHeight
    return {
      ...state,
      focusedIndex: index,
      minLineY,
      maxLineY,
      negativeMargin,
    }
  }
  if (index >= state.maxLineY - 1) {
    //  scroll down
    const maxLineY = index + 1
    const minLineY = maxLineY - Math.ceil(listHeight / itemHeight)
    const negativeMargin =
      -minLineY * itemHeight + (listHeight % itemHeight) - itemHeight
    return {
      ...state,
      focusedIndex: index,
      minLineY,
      maxLineY,
      negativeMargin,
    }
  }
  return {
    ...state,
    focusedIndex: index,
  }
}
