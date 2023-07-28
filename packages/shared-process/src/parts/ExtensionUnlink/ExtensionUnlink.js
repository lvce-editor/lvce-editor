import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as RemoveSymlink from '../RemoveSymlink/RemoveSymlink.js'
import { VError } from '../VError/VError.js'

export const unlink = async (path) => {
  try {
    const manifest = await ExtensionManifest.get(path)
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      throw manifest.reason
    }
    const linkedExtensionsPath = Platform.getLinkedExtensionsPath()
    // @ts-ignore
    const to = Path.join(linkedExtensionsPath, manifest.id)
    await RemoveSymlink.removeSymlink(to)
  } catch (error) {
    throw new VError(error, `Failed to unlink extension`)
  }
}
