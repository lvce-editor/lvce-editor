import {
  getChildDirents,
  getParentStartIndex,
  mergeDirents,
} from './ViewletExplorerShared.js'

import * as DirentType from '../DirentType/DirentType.js'

const handleDropIntoFolder = async (state, dirent, index, files) => {
  console.log({ dirent, files })
  const { pathSeparator, root, dirents } = state
  const childDirents = await getChildDirents(root, pathSeparator, dirent)
  // TODO merge with child dirents
  const middleDirents = []
  const startIndex = index + 1
  const endIndex = index + 1
  const mergedDirents = [
    ...dirents.slice(0, startIndex),
    ...dirents.slice(endIndex),
  ]

  // const mergedDirents = mergeDirents(dirents, childDirents)
  console.log({ childDirents })
  return {
    ...state,
    dirents: mergedDirents,
  }
}

export const handleDropIndex = (state, index, files) => {
  const { dirents } = state
  const dirent = dirents[index]
  // TODO if it is a file, drop into the folder of the file
  // TODO if it is a folder, drop into the folder
  // TODO if it is a symlink, read symlink and determine if file can be dropped
  switch (dirent.type) {
    case DirentType.Directory:
      return handleDropIntoFolder(state, dirent, index, files)
    default:
      return state
  }
}
