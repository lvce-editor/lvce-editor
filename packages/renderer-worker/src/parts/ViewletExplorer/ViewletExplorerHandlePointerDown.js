import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'

export const handlePointerDown = (state, button, x, y) => {
  const index = getIndexFromPosition(state, x, y)
  if (button === MouseEventType.LeftClick && index === -1) {
    return {
      ...state,
      focused: true,
      focusedIndex: -1,
    }
  }
  return state
}
