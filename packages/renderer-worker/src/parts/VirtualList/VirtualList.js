import * as Assert from '../Assert/Assert.js'

export const setDeltaY = (state, deltaY) => {
  Assert.object(state)
  Assert.number(deltaY)
  const { itemHeight, items, height } = state
  const itemsLength = items.length
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > itemsLength * itemHeight - height) {
    deltaY = Math.max(itemsLength * itemHeight - height, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / itemHeight)
  const maxLineY = minLineY + Math.round(height / itemHeight)
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
