// TODO duplicate code with Extensions List

import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'
import { getListHeight } from './ViewletSearchShared.js'

export const setDeltaY = (state, value) => {
  Assert.object(state)
  Assert.number(value)
  const listHeight = getListHeight(state)
  const { itemHeight, finalDeltaY, deltaY } = state
  const newDeltaY = Clamp.clamp(value, 0, finalDeltaY)
  if (deltaY === newDeltaY) {
    return state
  }
  // TODO when it only moves by one px, extensions don't need to be rerendered, only negative margin
  const minLineY = Math.floor(newDeltaY / itemHeight)
  const maxLineY = minLineY + Math.ceil(listHeight / itemHeight)
  return {
    ...state,
    deltaY: newDeltaY,
    minLineY,
    maxLineY,
  }
}
