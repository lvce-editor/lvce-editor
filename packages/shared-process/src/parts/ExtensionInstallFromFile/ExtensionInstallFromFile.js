import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Extract from '../Extract/Extract.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'

const getCachedExtensionFolderName = (path) => {
  const baseName = Path.basename(path)
  if (baseName.endsWith('.tar.br')) {
    return 'file-' + baseName.slice(0, -'.tar.br'.length)
  }
  return `file-${baseName}`
}

export const install = async ({ path }) => {
  try {
    const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    const cachedExtensionFolderName = getCachedExtensionFolderName(path)
    const cachedExtensionPath = Path.join(
      cachedExtensionsPath,
      cachedExtensionFolderName
    )
    await Extract.extractTarBr(path, cachedExtensionPath)
    const extensionsPath = Platform.getExtensionsPath()
    const manifestPath = Path.join(cachedExtensionPath, 'extension.json')
    const manifestContent = await FileSystem.readFile(manifestPath)
    const manifestJson = JSON.parse(manifestContent)
    const id = manifestJson.id
    if (!id) {
      throw new Error('missing id in extension manifest')
    }
    const outDir = Path.join(extensionsPath, id)
    await FileSystem.remove(outDir)
    await FileSystem.rename(cachedExtensionPath, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install ${path}`)
  }
}
