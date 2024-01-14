import * as SetDeltaY from './VirtualListSetDeltaY.js'

export const scrollDown = (state) => {
  const { finalDeltaY, deltaY } = state
  const newDeltaY = Math.min(deltaY + 20, finalDeltaY)
  return SetDeltaY.setDeltaY(state, newDeltaY)
}
