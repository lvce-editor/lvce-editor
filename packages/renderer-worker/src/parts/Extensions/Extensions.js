import * as OpenNativeFolder from '../OpenNativeFolder/OpenNativeFolder.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const openExtensionsFolder = async () => {
  const extensionsFolder = await PlatformPaths.getExtensionsPath()
  await OpenNativeFolder.openNativeFolder(extensionsFolder)
}

export const openCachedExtensionsFolder = async () => {
  const cachedExtensionsFolder = await PlatformPaths.getCachedExtensionsPath()
  await OpenNativeFolder.openNativeFolder(cachedExtensionsFolder)
}
