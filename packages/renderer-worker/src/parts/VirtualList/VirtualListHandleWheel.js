import { setDeltaY } from './VirtualListSetDeltaY.js'

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}
