import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.ts'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.ts'
import * as Path from '../Path/Path.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as RemoveSymlink from '../RemoveSymlink/RemoveSymlink.ts'
import { VError } from '../VError/VError.ts'

export const unlink = async (path) => {
  try {
    const manifest = await ExtensionManifest.get(path)
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      throw manifest.reason
    }
    const linkedExtensionsPath = PlatformPaths.getLinkedExtensionsPath()
    // @ts-ignore
    const to = Path.join(linkedExtensionsPath, manifest.id)
    await RemoveSymlink.removeSymlink(to)
  } catch (error) {
    throw new VError(error, `Failed to unlink extension`)
  }
}
