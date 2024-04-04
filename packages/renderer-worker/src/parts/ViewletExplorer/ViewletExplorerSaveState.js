import * as DirentType from '../DirentType/DirentType.js'

const isExpandedDirectory = (dirent) => {
  return dirent.type === DirentType.DirectoryExpanded
}

const getPath = (dirent) => {
  return dirent.path
}

export const saveState = (state) => {
  const { items, root, deltaY, minLineY, maxLineY } = state
  const expandedPaths = items.filter(isExpandedDirectory).map(getPath)
  return {
    expandedPaths,
    root,
    minLineY,
    maxLineY,
    deltaY,
  }
}
