import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'

export const getExtensionManifests = async (path) => {
  if (path) {
    const manifest = await ExtensionManifest.get(path)
    return [manifest]
  }
  return []
}
