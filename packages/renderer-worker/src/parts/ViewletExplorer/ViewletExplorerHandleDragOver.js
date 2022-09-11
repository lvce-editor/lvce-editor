import * as Assert from '../Assert/Assert.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'

const isEqual = (a, b) => {
  if (a.length !== b.length) {
    return false
  }
  const length = a.length
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export const handleDragOver = (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const { dropTargets } = state
  const index = getIndexFromPosition(state, x, y)
  const newDropTargets = [index]
  if (isEqual(dropTargets, newDropTargets)) {
    return state
  }
  return {
    ...state,
    dropTargets: newDropTargets,
  }
}
