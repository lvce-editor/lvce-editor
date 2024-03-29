import * as ReadJson from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import { VError } from '../VError/VError.js'
import * as ExtensionManagement from './ExtensionManagement.js'

export const getIconTheme = async (iconThemeId) => {
  const extensions = await ExtensionManagement.getExtensions()
  for (const extension of extensions) {
    if (!extension.iconThemes) {
      continue
    }
    for (const iconTheme of extension.iconThemes) {
      if (iconTheme.id !== iconThemeId) {
        continue
      }
      const absolutePath = Path.join(extension.path, iconTheme.path)
      try {
        const json = await ReadJson.readJson(absolutePath)
        return {
          extensionPath: extension.path,
          json,
        }
      } catch (error) {
        throw new VError(error, `Failed to load icon theme "${iconThemeId}"`)
      }
    }
  }
  throw new VError(`Icon theme "${iconThemeId}" not found in extensions folder`)
}
