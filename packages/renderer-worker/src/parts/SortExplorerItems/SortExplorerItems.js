import * as Compare from '../Compare/Compare.js'
import * as DirentType from '../DirentType/DirentType.js'

export const getIndexFromPosition = (state, eventX, eventY) => {
  const { y, itemHeight, items } = state
  const index = Math.floor((eventY - y) / itemHeight)
  if (index < 0) {
    return 0
  }
  if (index >= items.length) {
    return -1
  }
  return index
}

const priorityMapFoldersFirst = {
  [DirentType.Directory]: 1,
  [DirentType.SymLinkFolder]: 1,
  [DirentType.File]: 0,
  [DirentType.SymLinkFile]: 0,
  [DirentType.Unknown]: 0,
  [DirentType.Socket]: 0,
}

const compareDirentType = (direntA, direntB) => {
  return priorityMapFoldersFirst[direntB.type] - priorityMapFoldersFirst[direntA.type]
}

const compareDirentName = (direntA, direntB) => {
  return Compare.compareString(direntA.name, direntB.name)
}

export const compareDirent = (direntA, direntB) => {
  return compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
}

export const sortExplorerItems = (rawDirents) => {
  rawDirents.sort(compareDirent)
}
