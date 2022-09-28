import * as Assert from '../Assert/Assert.js'

export const handleTouchStart = (state, timeStamp, touches) => {
  Assert.number(timeStamp)
  Assert.array(touches)
  if (touches.length === 0) {
    return state
  }
  const touch = touches[0]
  const { clientY } = touch
  return {
    ...state,
    touchOffsetY: clientY,
  }
}
