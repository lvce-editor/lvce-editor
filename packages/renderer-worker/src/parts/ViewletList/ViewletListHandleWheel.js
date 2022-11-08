import { setDeltaY } from './ViewletListSetDeltaY.js'

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}
