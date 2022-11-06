import { getListHeight } from './ViewletExtensionsShared.js'

export const focusIndex = (state, index) => {
  const { itemHeight, minLineY, maxLineY } = state
  if (index === -1) {
    return {
      ...state,
      focusedIndex: -1,
      focused: true,
    }
  }
  const listHeight = getListHeight(state)
  if (index < minLineY + 1) {
    console.log('if 1')
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
    console.log('if 2')

    //  scroll down
    const newMaxLineY = index + 1
    const newMinLineY = newMaxLineY - Math.ceil(listHeight / itemHeight)
    const newDeltaY =
      newMinLineY * itemHeight + (listHeight % itemHeight) - itemHeight
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
