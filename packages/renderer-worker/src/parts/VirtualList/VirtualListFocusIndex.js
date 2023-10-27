import * as Assert from '../Assert/Assert.js'

const focusIndexScrollUp = (state, index, listHeight, itemHeight, itemsLength) => {
  const newMinLineY = index
  const fittingItems = Math.ceil(listHeight / itemHeight)
  const newMaxLineY = Math.min(newMinLineY + fittingItems, itemsLength)
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

const focusIndexScrollDown = (state, index, listHeight, itemHeight, itemsLength) => {
  const newMaxLineY = index + 1
  const fittingItems = Math.ceil(listHeight / itemHeight)
  const newMinLineY = newMaxLineY - fittingItems
  const newDeltaY = newMinLineY * itemHeight - (listHeight % itemHeight) + itemHeight
  return {
    ...state,
    focusedIndex: index,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    focused: true,
    deltaY: newDeltaY,
  }
}

export const focusIndex = (state, index) => {
  const { itemHeight, minLineY, maxLineY, headerHeight, height, items } = state
  const itemsLength = items.length
  if (itemsLength === 0) {
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
    return focusIndexScrollUp(state, index, listHeight, itemHeight, itemsLength)
  }
  if (index >= maxLineY - 1) {
    return focusIndexScrollDown(state, index, listHeight, itemHeight, itemsLength)
  }
  return {
    ...state,
    focusedIndex: index,
    focused: true,
  }
}
