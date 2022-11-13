import * as Assert from '../Assert/Assert.js'

export const create = ({
  itemHeight,
  headerHeight = 0,
  minimumSliderSize = 20,
}) => {
  return {
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    finalDeltaY: 0,
    itemHeight,
    headerHeight,
    items: [],
    minimumSliderSize,
    focusedIndex: -1,
    touchOffsetY: 0,
    touchTimeStamp: 0,
    touchDifference: 0,
    scrollBarHeight: 0,
  }
}

const getListHeight = (height, headerHeight) => {
  if (headerHeight) {
    return height - headerHeight
  }
  return headerHeight
}

export const setDeltaY = (state, deltaY) => {
  Assert.object(state)
  Assert.number(deltaY)
  const { itemHeight, items, height, headerHeight } = state
  const listHeight = getListHeight(height, headerHeight)
  const itemsLength = items.length
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > itemsLength * itemHeight - listHeight) {
    deltaY = Math.max(itemsLength * itemHeight - listHeight, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / itemHeight)
  const maxLineY = minLineY + Math.round(listHeight / itemHeight)
  Assert.number(minLineY)
  Assert.number(maxLineY)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
  }
}

export const handleWheel = (state, deltaY) => {
  Assert.object(state)
  Assert.number(deltaY)
  return setDeltaY(state, state.deltaY + deltaY)
}
