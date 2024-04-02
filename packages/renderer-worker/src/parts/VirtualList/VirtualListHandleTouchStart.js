import * as Assert from '../Assert/Assert.ts'

export const handleTouchStart = (state, timeStamp, touches) => {
  Assert.number(timeStamp)
  Assert.array(touches)
  if (touches.length === 0) {
    return state
  }
  const touch = touches[0]
  const { y } = touch
  Assert.number(y)
  return {
    ...state,
    touchOffsetY: y,
  }
}
