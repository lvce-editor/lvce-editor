import * as UploadFileSystemHandles from '../UploadFileSystemHandles/UploadFileSystemHandles.js'
import { getChildDirents } from './ViewletExplorerShared.js'

const mergeDirents = (oldDirents, newDirents) => {
  return newDirents
}

const getMergedDirents = async (root, pathSeparator, dirents) => {
  const childDirents = await getChildDirents(pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

export const handleDrop = async (state, files) => {
  const { root, pathSeparator, items } = state
  const handled = await UploadFileSystemHandles.uploadFileSystemHandles(root, pathSeparator, files)
  if (handled) {
    return state
  }
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}
