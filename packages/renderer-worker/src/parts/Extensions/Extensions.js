import * as Open from '../Open/Open.js'
import * as Platform from '../Platform/Platform.js'

export const openExtensionsFolder = async () => {
  const extensionsFolder = await Platform.getExtensionsPath()
  await Open.openNativeFolder(extensionsFolder)
}

export const openCachedExtensionsFolder = async () => {
  const cachedExtensionsFolder = await Platform.getCachedExtensionsPath()
  await Open.openNativeFolder(cachedExtensionsFolder)
}
