import { setDeltaY } from './ViewletExtensions.js'
import { HEADER_HEIGHT } from './ViewletExtensionsShared.js'

export const handleTouchMove = (state, touches) => {
  const { top, touchOffsetY, deltaY } = state
  const touch = touches[0]
  const { clientY } = touch
  const newTouchOffsetY = clientY - top - HEADER_HEIGHT
  const diff = newTouchOffsetY - touchOffsetY
  const newDeltaY = deltaY - diff
  return {
    ...setDeltaY(state, newDeltaY),
    touchOffsetY: newTouchOffsetY,
  }
}
