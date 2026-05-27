import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'

export const getExtensionManifests = async (path) => {
  if (!path) {
    return []
  }
  const manifest = await ExtensionManifest.get(path)
  if (manifest.status === ExtensionManifestStatus.Rejected) {
    return [manifest]
  }
  return [
    {
      ...manifest,
      symlink: path,
    },
  ]
}
