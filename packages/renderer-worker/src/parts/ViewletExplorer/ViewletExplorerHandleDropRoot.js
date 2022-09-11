import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import { getChildDirents } from './ViewletExplorerShared.js'

const mergeDirents = (oldDirents, newDirents) => {
  const mergedDirents = []
  const newFolders = []
  for (let i = 0; i < oldDirents.length; i++) {
    const oldDirent = oldDirents[i]
    if (oldDirent.type === DirentType.DirectoryExpanded) {
      let childStartIndex = i
      let childEndIndex = i + 1
      while (childEndIndex < oldDirents.length) {
        if (oldDirents[childEndIndex].depth <= oldDirent.depth) {
          break
        }
        childEndIndex++
      }
      console.log({ childStartIndex, childEndIndex })
      // for (let j = i + 1; j < oldDirents.length; j++) {
      //   const child = oldDirents[j]
      //   if (child.depth > oldDirent.depth) {
      //   }
      // }
    }
  }
  for (const oldDirent of oldDirents) {
    if (oldDirent.type === DirentType.DirectoryExpanded) {
    }
  }
  const childMap = Object.create(null)
  for (const newDirent of newDirents) {
    // newFolders.push(Workspace.pathDirName(newDirent.path))
    mergedDirents.push(newDirent)
  }
  // for (const oldDirent of oldDirents) {
  //   const parentPath = Workspace.pathDirName(oldDirent.path)
  // }
  return mergedDirents
}

// TODO copy files in parallel
const copyFiles = async (root, pathSeparator, files) => {
  const pathsToRefresh = []
  for (const file of files) {
    const from = file.path
    const to = root + pathSeparator + file.name
    await FileSystem.copy(from, to)
    pathsToRefresh.push(root)
  }
  return pathsToRefresh
}

export const handleDropRoot = async (state, files) => {
  const { root, pathSeparator, dirents } = state
  const pathsToRefresh = await copyFiles(root, pathSeparator, files)
  const pathToRefresh = pathsToRefresh[0] // TODO support multiple paths to refresh
  console.log({ pathToRefresh })
  const childDirents = await getChildDirents(root, pathSeparator, {
    path: root,
    depth: 0,
  })
  console.log({ childDirents })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return {
    ...state,
    dirents: mergedDirents,
    dropTargets: [],
  }
}
