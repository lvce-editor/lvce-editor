import { setDeltaY } from './ViewletExtensions.js'

export const handleTouchMove = (state, touches) => {
  if (touches.length === 0) {
    return state
  }
  const { touchOffsetY, deltaY } = state
  const touch = touches[0]
  const { clientY } = touch
  const newTouchOffsetY = clientY
  const diff = newTouchOffsetY - touchOffsetY
  const newDeltaY = deltaY - diff
  return {
    ...setDeltaY(state, newDeltaY),
    touchOffsetY: newTouchOffsetY,
  }
}
