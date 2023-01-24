import * as Command from '../Command/Command.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FilesystemHandle from '../FileSystemHandle/FileSystemHandle.js'
import * as Path from '../Path/Path.js'
import { getChildDirents } from './ViewletExplorerShared.js'

const mergeDirents = (oldDirents, newDirents) => {
  return newDirents
}

const getMergedDirents = async (root, pathSeparator, dirents) => {
  const childDirents = await getChildDirents(pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

const uploadFilesDefault = async (root, pathSeparator, fileSystemHandles) => {
  if (fileSystemHandles.length === 1) {
    const file = fileSystemHandles[0]
    const { name, kind } = file
    if (kind === FileHandleType.Directory) {
      await Command.execute('PersistentFileHandle.addHandle', `html://${name}`, file)
      await Command.execute('Workspace.setPath', `html://${name}`)
      return true
    }
  }
  for (const fileSystemHandle of fileSystemHandles) {
    const { name, kind } = fileSystemHandle
    if (kind === FileHandleType.Directory) {
      throw new Error('folder upload is not yet supported')
    }
    const content = await FilesystemHandle.getText(fileSystemHandle)
    const to = Path.join(pathSeparator, root, fileSystemHandle.name)
    await FileSystem.writeFile(to, content, EncodingType.Binary)
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
