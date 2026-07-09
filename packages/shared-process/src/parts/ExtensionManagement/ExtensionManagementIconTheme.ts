import * as ReadJson from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'
import { VError } from '../VError/VError.ts'
import * as ExtensionManagement from './ExtensionManagement.ts'

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
