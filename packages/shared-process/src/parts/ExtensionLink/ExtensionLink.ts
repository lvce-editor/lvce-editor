import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.ts'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Path from '../Path/Path.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as SymLink from '../SymLink/SymLink.ts'
import { VError } from '../VError/VError.ts'

const linkFallBack = async (path) => {
  try {
    const manifest = await ExtensionManifest.get(path)
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      throw manifest.reason
    }
    const linkedExtensionsPath = PlatformPaths.getLinkedExtensionsPath()
    // @ts-ignore
    const to = Path.join(linkedExtensionsPath, manifest.id)
    await FileSystem.remove(to)
    await SymLink.createSymLink(path, to)
  } catch (error) {
    throw new VError(error, `Failed to link extension`)
  }
}

export const link = async (path) => {
  try {
    const manifest = await ExtensionManifest.get(path)
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      throw manifest.reason
    }
    const linkedExtensionsPath = PlatformPaths.getLinkedExtensionsPath()
    // @ts-ignore
    const to = Path.join(linkedExtensionsPath, manifest.id)
    await SymLink.createSymLink(path, to)
  } catch (error) {
    if (error && error.code === ErrorCodes.E_MANIFEST_NOT_FOUND) {
      throw new VError(`Failed to link extension: Extension manifest not found '${error.path}'`)
    }
    if (error && error.code === ErrorCodes.EEXIST) {
      return linkFallBack(path)
    }
    throw new VError(error, `Failed to link extension`)
  }
}
