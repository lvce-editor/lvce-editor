import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.ts'

export const mergeWithSymLinks = (manifests: any, symlinks: any): any => {
  const { length } = manifests
  const merged: any[] = []
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
