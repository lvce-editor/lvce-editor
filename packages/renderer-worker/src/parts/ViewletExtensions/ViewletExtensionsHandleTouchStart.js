import { HEADER_HEIGHT } from './ViewletExtensionsShared.js'

export const handleTouchStart = (state, touches) => {
  const { top } = state
  const touch = touches[0]
  const { clientY } = touch
  const touchOffsetY = clientY - top - HEADER_HEIGHT
  return {
    ...state,
    touchOffsetY,
  }
}
