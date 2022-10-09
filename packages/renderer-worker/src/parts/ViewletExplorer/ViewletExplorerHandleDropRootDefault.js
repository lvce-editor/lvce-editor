import * as Command from '../Command/Command.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import { getChildDirents } from './ViewletExplorerShared.js'

const mergeDirents = (oldDirents, newDirents) => {
  return newDirents
}

const getMergedDirents = async (root, pathSeparator, dirents) => {
  const childDirents = await getChildDirents(root, pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

const uploadFilesDefault = async (root, pathSeparator, files) => {
  if (files.length === 1) {
    const file = files[0]
    const { name, kind } = file
    if (kind === FileHandleType.Directory) {
      await Command.execute(
        'PersistentFileHandle.addHandle',
        `html://${name}`,
        file
      )
      await Command.execute('Workspace.setPath', `html://${name}`)
      return true
    }
  }
  for (const file of files) {
    const { name, kind } = file
    if (kind === FileHandleType.Directory) {
      throw new Error('folder upload is not yet supported')
    }
    const content = await Command.execute('Blob.blobToBinaryString', file)
    const to = Path.join(pathSeparator, root, file.name)
    await FileSystem.writeFile(to, content, 'binary')
  }
  return false
}

export const handleDrop = async (state, files) => {
  const { root, pathSeparator, items } = state
  const handled = await uploadFilesDefault(root, pathSeparator, files)
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
