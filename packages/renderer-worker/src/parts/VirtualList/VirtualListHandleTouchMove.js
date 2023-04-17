import * as Assert from '../Assert/Assert.js'
import { setDeltaY } from './VirtualListSetDeltaY.js'

export const handleTouchMove = (state, timeStamp, touches) => {
  Assert.number(timeStamp)
  Assert.array(touches)
  if (touches.length === 0) {
    return state
  }
  const { touchOffsetY, deltaY, touchTimeStamp } = state
  const touch = touches[0]
  const { y } = touch
  Assert.number(y)
  const newTouchOffsetY = y
  const touchDifference = newTouchOffsetY - touchOffsetY
  const newDeltaY = deltaY - touchDifference
  const timeDifference = timeStamp - touchTimeStamp
  return {
    ...setDeltaY(state, newDeltaY),
    touchOffsetY: newTouchOffsetY,
    touchDifference,
  }
}
