import * as BuiltinExtensionsPath from '../BuiltinExtensionsPath/BuiltinExtensionsPath.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.ts'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as Platform from '../Platform/Platform.ts'
import * as ToAbsolutePaths from '../ToAbsolutePaths/ToAbsolutePaths.ts'
import { VError } from '../VError/VError.ts'

let builtinManifests: { path: string; promise: Promise<any[]> } | undefined

const readExtensionManifests = async (path: string): Promise<any[]> => {
  const dirents = await FileSystem.readDirWithFileTypes(path)
  const folderNames = dirents.filter((dirent: any) => dirent.type === DirentType.Directory).map((dirent: any) => dirent.name)
  const absolutePaths = ToAbsolutePaths.toAbsolutePaths(path, folderNames)
  return Promise.all(absolutePaths.map(ExtensionManifest.get))
}

export const getExtensionManifests = async (path: any): Promise<any> => {
  let cached: typeof builtinManifests
  try {
    if (!path) {
      return []
    }
    // Packaged builtins are fixed for this process. User and development extensions stay live.
    if (!Platform.isProduction || path !== BuiltinExtensionsPath.getBuiltinExtensionsPath()) {
      return await readExtensionManifests(path)
    }
    if (!builtinManifests || builtinManifests.path !== path) {
      builtinManifests = { path, promise: readExtensionManifests(path) }
    }
    cached = builtinManifests
    const manifests = await cached.promise
    if (manifests.some((manifest) => manifest.status === ExtensionManifestStatus.Rejected)) {
      if (builtinManifests === cached) {
        builtinManifests = undefined
      }
      return manifests
    }
    // Keep request-local metadata and nested contributions independent of the cached values.
    return structuredClone(manifests)
  } catch (error) {
    if (cached && builtinManifests === cached) {
      builtinManifests = undefined
    }
    if (IsEnoentError.isEnoentError(error)) {
      return []
    }
    throw new VError(error, 'Failed to get extension manifests')
  }
}
