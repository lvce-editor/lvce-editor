import {
  getChildDirents,
  getParentStartIndex,
} from './ViewletExplorerShared.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import { handleDropRoot } from './ViewletExplorerHandleDropRoot.js'

const handleDropIntoFolder = async (state, dirent, index, files) => {
  const { pathSeparator, root, dirents } = state
  for (const file of files) {
    const from = file.path
    const to = dirent.path + pathSeparator + file.name
    await FileSystem.copy(from, to)
  }
  const childDirents = await getChildDirents(root, pathSeparator, dirent)
  // TODO merge with child dirents
  const middleDirents = []
  const startIndex = index + 1
  const endIndex = index + 2
  const mergedDirents = [
    ...dirents.slice(0, startIndex),
    ...childDirents,
    ...dirents.slice(endIndex),
  ]

  // const mergedDirents = mergeDirents(dirents, childDirents)
  console.log({ childDirents })
  return {
    ...state,
    dirents: mergedDirents,
    dropTargets: [],
  }
}

const handleDropIntoFile = (state, dirent, index, files) => {
  const { dirents } = state
  const parentIndex = getParentStartIndex(dirents, index)
  if (parentIndex === -1) {
    return handleDropRoot(state, files)
  }
  return handleDropIndex(parentIndex)
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
    case DirentType.File:
      return handleDropIntoFile(state, dirent, index, files)
    default:
      return state
  }
}
