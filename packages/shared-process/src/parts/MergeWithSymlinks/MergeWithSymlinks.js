import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'

export const mergeWithSymLinks = (manifests, symlinks) => {
  const { length } = manifests
  const merged = []
  for (let i = 0; i < length; i++) {
    const manifest = manifests[i]
    const symlink = symlinks[i]
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      merged.push(manifest)
    } else {
      merged.push({ ...manifest, symlink })
    }
  }
  return merged
}
