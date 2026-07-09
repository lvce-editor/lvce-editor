import * as Extract from '../Extract/Extract.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import { VError } from '../VError/VError.ts'

const getCachedExtensionFolderName = (path) => {
  const baseName = Path.basename(path)
  if (baseName.endsWith('.tar.br')) {
    return 'file-' + baseName.slice(0, -'.tar.br'.length)
  }
  return `file-${baseName}`
}

export const install = async ({ path }) => {
  try {
    const cachedExtensionsPath = PlatformPaths.getCachedExtensionsPath()
    const cachedExtensionFolderName = getCachedExtensionFolderName(path)
    const cachedExtensionPath = Path.join(cachedExtensionsPath, cachedExtensionFolderName)
    await Extract.extractTarBr(path, cachedExtensionPath)
    const extensionsPath = PlatformPaths.getExtensionsPath()
    const manifestPath = Path.join(cachedExtensionPath, 'extension.json')
    const manifestJson = await JsonFile.readJson(manifestPath)
    const { id } = manifestJson
    if (!id) {
      throw new Error('missing id in extension manifest')
    }
    const outDir = Path.join(extensionsPath, id)
    await FileSystem.remove(outDir)
    await FileSystem.mkdir(Path.dirname(outDir))
    await FileSystem.rename(cachedExtensionPath, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install ${path}`)
  }
}
