export const handleTouchStart = (state, touches) => {
  const touch = touches[0]
  const { clientY } = touch
  return {
    ...state,
    touchOffsetY: clientY,
  }
}
