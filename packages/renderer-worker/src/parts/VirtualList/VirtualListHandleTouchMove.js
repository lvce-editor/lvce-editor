import * as Assert from '../Assert/Assert.ts'
import { setDeltaY } from './VirtualListSetDeltaY.js'

export const handleTouchMove = (state, timeStamp, touches) => {
  Assert.number(timeStamp)
  Assert.array(touches)
  if (touches.length === 0) {
    return state
  }
  const { touchOffsetY, deltaY } = state
  const touch = touches[0]
  const { y } = touch
  Assert.number(y)
  const newTouchOffsetY = y
  const touchDifference = newTouchOffsetY - touchOffsetY
  const newDeltaY = deltaY - touchDifference
  return {
    ...setDeltaY(state, newDeltaY),
    touchOffsetY: newTouchOffsetY,
    touchDifference,
  }
}
