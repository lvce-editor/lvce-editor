import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import { getChildDirents } from './ViewletExplorerShared.js'

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
  const { root, pathSeparator, dirents } = state
  await copyFilesElectron(root, pathSeparator, files)
  const mergedDirents = await getMergedDirents(root, pathSeparator, dirents)
  return {
    ...state,
    dirents: mergedDirents,
    dropTargets: [],
  }
}

const getFileContent = async (file) => {
  const fileReader = new FileReader()
  const content = await new Promise((resolve, reject) => {
    const handleLoad = (event) => {
      const fileContent = event.target.result
      resolve(fileContent)
    }
    fileReader.onload = handleLoad
    fileReader.readAsText(file)
  })
  return content
}

const handleDropRootDefault = async (state, files) => {
  const { root, pathSeparator, dirents } = state
  for (const file of files) {
    const content = await getFileContent(file)
    const to = Path.join(pathSeparator, root, file.name)
    await FileSystem.writeFile(to, content)
  }
  const mergedDirents = await getMergedDirents(root, pathSeparator, dirents)
  return {
    ...state,
    dirents: mergedDirents,
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
