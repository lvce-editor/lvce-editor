import * as FileSystem from '../FileSystem/FileSystem.js'
import * as DirentType from '../DirentType/DirentType.js'

// TODO copy files in parallel
const copyFiles = async (root, pathSeparator, files) => {
  const newDirents = []
  for (const file of files) {
    const from = file.path
    const to = root + pathSeparator + file.name
    await FileSystem.copy(from, to)
    const newDirent = {
      type: DirentType.File, // TODO stat the new file
      path: to,
      posInSet: 1, // TODO
      setSize: 1, // TODO
    }
    newDirents.push(newDirent)
  }
  return newDirents
}

export const handleDrop = async (state, files) => {
  const { root, pathSeparator } = state
  const newDirents = await copyFiles(root, pathSeparator, files)

  // TODO update state
  return {
    ...state,
    dirents: newDirents,
  }
}
