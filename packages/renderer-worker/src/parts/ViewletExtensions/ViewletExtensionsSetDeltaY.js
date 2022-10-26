import * as Assert from '../Assert/Assert.js'
import { getListHeight } from './ViewletExtensionsShared.js'

export const setDeltaY = (state, deltaY) => {
  Assert.object(state)
  Assert.number(deltaY)
  const listHeight = getListHeight(state)
  const { itemHeight, finalDeltaY } = state
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > finalDeltaY) {
    deltaY = Math.max(finalDeltaY, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  // TODO when it only moves by one px, extensions don't need to be rerendered, only negative margin
  const minLineY = Math.floor(deltaY / itemHeight)
  const maxLineY = minLineY + Math.ceil(listHeight / itemHeight)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
  }
}
