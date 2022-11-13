import * as Assert from '../Assert/Assert.js'

export const focusIndex = (state, index) => {
  const { itemHeight, minLineY, maxLineY, headerHeight, height, items } = state
  if (items.length === 0) {
    return state
  }
  Assert.number(itemHeight)
  if (index === -1) {
    return {
      ...state,
      focusedIndex: -1,
      focused: true,
    }
  }
  const listHeight = height - headerHeight
  if (index < minLineY + 1) {
    // scroll up
    const newMinLineY = index
    const newMaxLineY = newMinLineY + Math.ceil(listHeight / itemHeight)
    const newDeltaY = newMinLineY * itemHeight
    return {
      ...state,
      focusedIndex: index,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      focused: true,
      deltaY: newDeltaY,
    }
  }
  if (index >= maxLineY - 1) {
    //  scroll down
    const newMaxLineY = index + 1
    const newMinLineY = newMaxLineY - Math.ceil(listHeight / itemHeight)
    const newDeltaY =
      newMinLineY * itemHeight - (listHeight % itemHeight) + itemHeight
    return {
      ...state,
      focusedIndex: index,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      focused: true,
      deltaY: newDeltaY,
    }
  }
  return {
    ...state,
    focusedIndex: index,
    focused: true,
  }
}
