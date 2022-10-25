import { setDeltaY } from './ViewletExtensionsSetDeltaY.js'

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}
