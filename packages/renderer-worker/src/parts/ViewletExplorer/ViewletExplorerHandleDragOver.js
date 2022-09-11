import * as Assert from '../Assert/Assert.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'

export const handleDragOver = (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const index = getIndexFromPosition(state, x, y)
  console.log('explorer drag over', { index })
  return state
}
