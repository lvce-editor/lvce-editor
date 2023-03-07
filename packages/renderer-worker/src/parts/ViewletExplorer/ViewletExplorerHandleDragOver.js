import * as Assert from '../Assert/Assert.js'
import * as DirentType from '../DirentType/DirentType.js'
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

const canBeDroppedInto = (dirent) => {
  if (!dirent) {
    return false
  }
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      return true
    default:
      return false
  }
}

const getNewDropTargets = (state, x, y) => {
  const { items } = state
  const index = getIndexFromPosition(state, x, y)
  const item = items[index]
  if (!canBeDroppedInto(item)) {
    return []
  }
  const newDropTargets = [index]
  return newDropTargets
}

export const handleDragOver = (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const { dropTargets } = state
  const newDropTargets = getNewDropTargets(state, x, y)
  if (isEqual(dropTargets, newDropTargets)) {
    return state
  }
  return {
    ...state,
    dropTargets: newDropTargets,
  }
}
