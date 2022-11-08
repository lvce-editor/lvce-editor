import { setDeltaY } from './ViewletOutputSetDeltaY.js'

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}
