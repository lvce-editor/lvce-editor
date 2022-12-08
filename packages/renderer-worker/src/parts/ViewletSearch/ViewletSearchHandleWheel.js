import { setDeltaY } from './ViewletSearchSetDeltaY.js'

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}
