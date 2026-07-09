import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.ts'

export const getExtensionManifests = async (path: any): Promise<any> => {
  if (path) {
    const manifest = await ExtensionManifest.get(path)
    return [manifest]
  }
  return []
}
