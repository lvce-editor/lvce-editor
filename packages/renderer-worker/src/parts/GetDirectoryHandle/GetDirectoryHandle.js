import * as Path from '../Path/Path.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'

const pathSeparator = '/'

export const getDirectoryHandle = async (uri) => {
  const handle = await PersistentFileHandle.getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.dirname(pathSeparator, uri)
  if (uri === dirname) {
    return undefined
  }
  return getDirectoryHandle(dirname)
}
