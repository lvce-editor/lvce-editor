import * as Assert from '../Assert/Assert.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

const priorityMapFoldersFirst = {
  folder: 1,
  directory: 1,
  file: 0,
  unknown: 0,
  socket: 0,
}

const compareDirentType = (direntA, direntB) => {
  return (
    priorityMapFoldersFirst[direntB.type] -
    priorityMapFoldersFirst[direntA.type]
  )
}

const compareDirentName = (direntA, direntB) => {
  return direntA.name.localeCompare(direntB.name)
}

const compareDirent = (direntA, direntB) => {
  return (
    compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
  )
}

const toDisplayDirents = (root, pathSeparator, rawDirents, parentDirent) => {
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
  return rawDirents.map(toDisplayDirent)
}

export const getChildDirents = async (root, pathSeparator, parentDirent) => {
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
  const rawDirents = await FileSystem.readDirWithFileTypes(uri)
  const displayDirents = toDisplayDirents(
    root,
    pathSeparator,
    rawDirents,
    parentDirent
  )
  return displayDirents
}
