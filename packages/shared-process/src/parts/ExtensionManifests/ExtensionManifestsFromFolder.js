import VError from 'verror'
import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

const toAbsolutePaths = (path, dirents) => {
  const absolutePaths = []
  for (const dirent of dirents) {
    absolutePaths.push(Path.join(path, dirent))
  }
  return absolutePaths
}

export const getExtensionManifests = async (path) => {
  try {
    if (!path) {
      return []
    }
    const dirents = await FileSystem.readDir(path)
    const absolutePaths = toAbsolutePaths(path, dirents)
    const manifests = await Promise.all(
      absolutePaths.map(ExtensionManifest.get)
    )
    return manifests
  } catch (error) {
    // TODO how to make typescript happy?
    // @ts-ignore
    if (error.code === ErrorCodes.ENOENT) {
      return []
    }
    throw new VError(error, 'Failed to get extension manifests')
  }
}
