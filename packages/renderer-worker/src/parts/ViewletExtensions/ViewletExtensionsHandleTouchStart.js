export const handleTouchStart = (state, touches) => {
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
