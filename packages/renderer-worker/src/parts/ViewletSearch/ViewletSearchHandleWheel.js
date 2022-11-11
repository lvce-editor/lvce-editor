// TODO duplicate code with Extensions List
import { setDeltaY } from './ViewletSearchSetDeltaY.js'

export const handleWheel = (state, deltaY) => {
  console.log('handle wheel', deltaY)
  return setDeltaY(state, state.deltaY + deltaY)
}
