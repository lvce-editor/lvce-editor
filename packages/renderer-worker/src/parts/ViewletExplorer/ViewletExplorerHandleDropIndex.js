import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Workspace from '../Workspace/Workspace.js'
import { handleDropRoot } from './ViewletExplorerHandleDropRoot.js'
import { getChildDirents, getParentStartIndex } from './ViewletExplorerShared.js'

const getEndIndex = (items, index, dirent) => {
  for (let i = index + 1; i < items.length; i++) {
    if (items[i].depth === dirent.depth) {
      return i
    }
  }
  return items.length
}

const getMergedDirents = (items, index, dirent, childDirents) => {
  const startIndex = index
  const endIndex = getEndIndex(items, index, dirent)
  const mergedDirents = [...items.slice(0, startIndex), { ...dirent, type: DirentType.DirectoryExpanded }, ...childDirents, ...items.slice(endIndex)]
  return mergedDirents
}

const handleDropIntoFolder = async (state, dirent, index, files) => {
  const { pathSeparator, items } = state
  for (const file of files) {
    const baseName = Workspace.pathBaseName(file)
    const to = dirent.path + pathSeparator + baseName
    await FileSystem.copy(file, to)
  }
  const childDirents = await getChildDirents(pathSeparator, dirent)
  const mergedDirents = getMergedDirents(items, index, dirent, childDirents)
  // TODO update maxlineY
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}

const handleDropIntoFile = (state, dirent, index, files) => {
  const { items } = state
  const parentIndex = getParentStartIndex(items, index)
  if (parentIndex === -1) {
    return handleDropRoot(state, files)
  }
  return handleDropIndex(parentIndex)
}

export const handleDropIndex = (state, index, files) => {
  const { items } = state
  const dirent = items[index]
  // TODO if it is a file, drop into the folder of the file
  // TODO if it is a folder, drop into the folder
  // TODO if it is a symlink, read symlink and determine if file can be dropped
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
      return handleDropIntoFolder(state, dirent, index, files)
    case DirentType.File:
      return handleDropIntoFile(state, dirent, index, files)
    default:
      return state
  }
}
