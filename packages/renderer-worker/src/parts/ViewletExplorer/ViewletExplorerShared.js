import * as Assert from '../Assert/Assert.js'
import * as Compare from '../Compare/Compare.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

export const getIndexFromPosition = (state, x, y) => {
  const { top, itemHeight, items } = state
  const index = Math.floor((y - top) / itemHeight)
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
  [DirentType.SymlinkFolder]: 1,
  [DirentType.File]: 0,
  [DirentType.SymlinkFile]: 0,
  [DirentType.Unknown]: 0,
  [DirentType.Socket]: 0,
}

const compareDirentType = (direntA, direntB) => {
  return (
    priorityMapFoldersFirst[direntB.type] -
    priorityMapFoldersFirst[direntA.type]
  )
}

const compareDirentName = (direntA, direntB) => {
  return Compare.compareString(direntA.name, direntB.name)
}

export const compareDirent = (direntA, direntB) => {
  return (
    compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
  )
}

const toDisplayDirents = (
  root,
  pathSeparator,
  rawDirents,
  parentDirent,
  excluded
) => {
  rawDirents.sort(compareDirent) // TODO maybe shouldn't mutate input argument, maybe sort after mapping
  // TODO figure out whether this uses too much memory (name,path -> redundant, depth could be computed on demand)
  const toDisplayDirent = (rawDirent, index) => {
    const path = parentDirent.path
      ? [parentDirent.path, rawDirent.name].join(pathSeparator)
      : [root, rawDirent.name].join(pathSeparator)
    return {
      name: rawDirent.name,
      posInSet: index + 1,
      setSize: rawDirents.length,
      depth: parentDirent.depth + 1,
      type: rawDirent.type,
      path, // TODO storing absolute path might be too costly, could also store relative path here
      icon: IconTheme.getIcon(rawDirent),
    }
  }
  const result = []
  let i = 0
  for (const rawDirent of rawDirents) {
    if (excluded.includes(rawDirent.name)) {
      continue
    }
    result.push(toDisplayDirent(rawDirent, i))
    i++
  }
  return result
}

export const getParentStartIndex = (dirents, index) => {
  const dirent = dirents[index]
  let startIndex = index - 1
  while (startIndex >= 0 && dirents[startIndex].depth >= dirent.depth) {
    startIndex--
  }
  return startIndex
}

export const getParentEndIndex = (dirents, index) => {
  const dirent = dirents[index]
  let endIndex = index + 1
  while (endIndex < dirents.length && dirents[endIndex].depth > dirent.depth) {
    endIndex++
  }
  return endIndex
}

const isSymbolicLink = (dirent) => {
  return dirent.type === DirentType.Symlink
}

const hasSymbolicLinks = (rawDirents) => {
  return rawDirents.some(isSymbolicLink)
}

const getSymlinkType = (type) => {
  switch (type) {
    case DirentType.File:
      return DirentType.SymlinkFile
    case DirentType.Directory:
      return DirentType.SymlinkFolder
    default:
      return DirentType.Symlink
  }
}
// TODO maybe resolving of symbolic links should happen in shared process?
// so that there is less code and less work in the frontend
const resolveSymbolicLink = async (uri, rawDirent) => {
  try {
    // TODO support windows paths
    const absolutePath = uri + '/' + rawDirent.name
    const type = await FileSystem.stat(absolutePath)
    const symLinkType = getSymlinkType(type)
    return {
      name: rawDirent.name,
      type: symLinkType,
    }
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      return {
        name: rawDirent.name,
        type: DirentType.SymlinkFile,
      }
    }
    console.error(
      `Failed to resolve symbolic link for ${rawDirent.name}: ${error}`
    )
    return rawDirent
  }
}

const resolveSymbolicLinks = async (uri, rawDirents) => {
  const resolvedDirents = []
  for (const rawDirent of rawDirents) {
    if (isSymbolicLink(rawDirent)) {
      const resolvedDirent = await resolveSymbolicLink(uri, rawDirent)
      resolvedDirents.push(resolvedDirent)
    } else {
      resolvedDirents.push(rawDirent)
    }
  }
  return resolvedDirents
}

export const getChildDirentsRaw = async (uri) => {
  const rawDirents = await FileSystem.readDirWithFileTypes(uri)
  if (hasSymbolicLinks(rawDirents)) {
    return resolveSymbolicLinks(uri, rawDirents)
  }
  return rawDirents
}

export const getChildDirents = async (
  root,
  pathSeparator,
  parentDirent,
  excluded = []
) => {
  Assert.string(root)
  Assert.string(pathSeparator)
  Assert.object(parentDirent)
  // TODO use event/actor based code instead, this is impossible to cancel right now
  // also cancel updating when opening new folder
  // const dispose = state => state.pendingRequests.forEach(cancelRequest)
  // TODO should use FileSystem directly in this case because it is globally available anyway
  // and more typesafe than Command.execute
  // and more performant
  const uri = parentDirent.path
  const rawDirents = await getChildDirentsRaw(uri)
  const displayDirents = toDisplayDirents(
    root,
    pathSeparator,
    rawDirents,
    parentDirent,
    excluded
  )
  return displayDirents
}

export const mergeDirents = (oldDirents, newDirents) => {
  const merged = []
  let oldIndex = 0
  for (const newDirent of newDirents) {
    merged.push(newDirent)
    for (let i = oldIndex; i < oldDirents.length; i++) {
      if (oldDirents[i].path === newDirent.path) {
        // TOOD copy children of old dirent
        oldIndex = i
        break
      }
    }
  }
  return merged
}

export const getTopLevelDirents = (root, pathSeparator, excluded) => {
  if (!root) {
    return []
  }
  return getChildDirents(
    root,
    pathSeparator,
    {
      depth: 0,
      path: root,
      type: DirentType.Directory,
    },
    excluded
  )
}
