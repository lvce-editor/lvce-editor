import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.js'
import * as Path from '../Path/Path.js'
import { getChildDirents } from './ViewletExplorerShared.js'

const mergeDirents = (oldDirents, newDirents) => {
  return newDirents
}

// TODO copy files in parallel
const copyFilesElectron = async (root, pathSeparator, files) => {
  for (const file of files) {
    const from = await GetFilePathElectron.getFilePathElectron(file)
    // const from = file.path
    const to = Path.join(pathSeparator, root, file.name)
    await FileSystem.copy(from, to)
  }
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
  console.log({ root, pathSeparator, files })
  await copyFilesElectron(root, pathSeparator, files)
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}
