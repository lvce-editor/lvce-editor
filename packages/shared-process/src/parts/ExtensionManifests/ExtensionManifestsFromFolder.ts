import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as ToAbsolutePaths from '../ToAbsolutePaths/ToAbsolutePaths.ts'
import { VError } from '../VError/VError.ts'

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
