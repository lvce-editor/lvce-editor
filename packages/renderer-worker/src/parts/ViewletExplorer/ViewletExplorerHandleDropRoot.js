import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import { getChildDirents } from './ViewletExplorerShared.js'
import * as Command from '../Command/Command.js'

const mergeDirents = (oldDirents, newDirents) => {
  return newDirents
}

// TODO copy files in parallel
const copyFilesElectron = async (root, pathSeparator, files) => {
  for (const file of files) {
    const from = file.path
    const to = Path.join(pathSeparator, root, file.name)
    await FileSystem.copy(from, to)
  }
}

const getMergedDirents = async (root, pathSeparator, dirents) => {
  const childDirents = await getChildDirents(root, pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

const handleDropRootElectron = async (state, files) => {
  const { root, pathSeparator, items } = state
  await copyFilesElectron(root, pathSeparator, files)
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}

const uploadFiles = async (root, pathSeparator, files) => {
  for (const file of files) {
    if (file.size === 0 || file.size === 4096) {
      throw new Error('folder upload is not yet supported')
    }
    const content = await Command.execute('Blob.blobToBinaryString', file)
    const to = Path.join(pathSeparator, root, file.name)
    await FileSystem.writeFile(to, content, 'binary')
  }
}

const handleDropRootDefault = async (state, files) => {
  const { root, pathSeparator, items } = state
  await uploadFiles(root, pathSeparator, files)
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}

export const handleDropRoot = (state, files) => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return handleDropRootElectron(state, files)
    default:
      return handleDropRootDefault(state, files)
  }
}
