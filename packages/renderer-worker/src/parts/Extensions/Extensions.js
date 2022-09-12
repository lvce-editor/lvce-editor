import * as OpenNativeFolder from '../OpenNativeFolder/OpenNativeFolder.js'
import * as Platform from '../Platform/Platform.js'

export const openExtensionsFolder = async () => {
  const extensionsFolder = await Platform.getExtensionsPath()
  await OpenNativeFolder.openNativeFolder(extensionsFolder)
}

export const openCachedExtensionsFolder = async () => {
  const cachedExtensionsFolder = await Platform.getCachedExtensionsPath()
  await OpenNativeFolder.openNativeFolder(cachedExtensionsFolder)
}
