import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'

export const setDeltaY = (state, value) => {
  Assert.object(state)
  Assert.number(value)
  const { itemHeight, finalDeltaY, deltaY, height } = state
  const newDeltaY = Clamp.clamp(value, 0, finalDeltaY)
  if (deltaY === newDeltaY) {
    return state
  }
  const minLineY = Math.floor(newDeltaY / itemHeight)
  const maxLineY = minLineY + Math.ceil(height / itemHeight)
  return {
    ...state,
    deltaY: newDeltaY,
    minLineY,
    maxLineY,
  }
}
