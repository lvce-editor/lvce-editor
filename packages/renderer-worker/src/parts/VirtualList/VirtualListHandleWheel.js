import * as Assert from '../Assert/Assert.ts'
import { setDeltaY } from './VirtualListSetDeltaY.js'

export const handleWheel = (state, deltaMode, deltaY) => {
  Assert.number(deltaMode)
  Assert.number(deltaY)
  return setDeltaY(state, state.deltaY + deltaY)
}
