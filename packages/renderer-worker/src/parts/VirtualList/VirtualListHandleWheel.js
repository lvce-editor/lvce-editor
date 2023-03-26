import { setDeltaY } from './VirtualListSetDeltaY.js'
import * as Assert from '../Assert/Assert.js'

export const handleWheel = (state, deltaMode, deltaY) => {
  Assert.number(deltaMode)
  Assert.number(deltaY)
  return setDeltaY(state, state.deltaY + deltaY)
}
