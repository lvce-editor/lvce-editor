import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as ToAbsolutePaths from '../ToAbsolutePaths/ToAbsolutePaths.js'
import { VError } from '../VError/VError.js'

export const getExtensionManifests = async (path) => {
  try {
    if (!path) {
      return []
    }
    const dirents = await FileSystem.readDirWithFileTypes(path)
    const folderNames = dirents.filter((dirent) => dirent.type === DirentType.Directory).map((dirent) => dirent.name)
    const absolutePaths = ToAbsolutePaths.toAbsolutePaths(path, folderNames)
    const manifests = await Promise.all(absolutePaths.map(ExtensionManifest.get))
    return manifests
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return []
    }
    throw new VError(error, 'Failed to get extension manifests')
  }
}
