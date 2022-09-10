import * as FileSystem from '../FileSystem/FileSystem.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

// TODO copy files in parallel
const copyFiles = async (root, pathSeparator, files) => {
  const droppedDirents = []
  for (const file of files) {
    const from = file.path
    const to = root + pathSeparator + file.name
    await FileSystem.copy(from, to)
    const icon = IconTheme.getFileIcon({
      name: file.name,
    })
    const newDirent = {
      type: DirentType.File, // TODO stat the new file
      path: to,
      posInSet: 1, // TODO
      setSize: 1, // TODO
      name: file.name,
      icon,
      depth: 1, // TODO
    }
    droppedDirents.push(newDirent)
  }
  return droppedDirents
}

export const handleDrop = async (state, files) => {
  const { root, pathSeparator, dirents } = state
  const droppedDirents = await copyFiles(root, pathSeparator, files)
  const newDirents = [...dirents, ...droppedDirents]
  return {
    ...state,
    dirents: newDirents,
  }
}
