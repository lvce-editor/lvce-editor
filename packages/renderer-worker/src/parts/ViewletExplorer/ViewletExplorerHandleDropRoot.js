import * as FileSystem from '../FileSystem/FileSystem.js'
import { getChildDirents } from './ViewletExplorerShared.js'

const mergeDirents = (oldDirents, newDirents) => {
  return newDirents
}

// TODO copy files in parallel
const copyFiles = async (root, pathSeparator, files) => {
  for (const file of files) {
    const from = file.path
    const to = root + pathSeparator + file.name
    await FileSystem.copy(from, to)
  }
}

export const handleDropRoot = async (state, files) => {
  const { root, pathSeparator, dirents } = state
  await copyFiles(root, pathSeparator, files)
  const childDirents = await getChildDirents(root, pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return {
    ...state,
    dirents: mergedDirents,
    dropTargets: [],
  }
}
