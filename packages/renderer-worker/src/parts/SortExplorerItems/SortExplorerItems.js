import * as Compare from '../Compare/Compare.js'
import * as DirentType from '../DirentType/DirentType.js'

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
  return Compare.compareStringNumeric(direntA.name, direntB.name)
}

export const compareDirent = (direntA, direntB) => {
  return compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
}

export const sortExplorerItems = (rawDirents) => {
  rawDirents.sort(compareDirent)
}
