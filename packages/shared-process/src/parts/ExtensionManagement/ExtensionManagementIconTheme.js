import * as Error from '../Error/Error.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
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
      const absolutePath = `${extension.path}/${iconTheme.path}`
      try {
        const json = await ReadJson.readJson(absolutePath)
        return {
          extensionPath: extension.path,
          json,
        }
      } catch (error) {
        throw new Error.OperationalError({
          cause: error,
          code: 'E_ICON_THEME_COULD_NOT_BE_LOADED',
          message: `Failed to load icon theme "${iconThemeId}"`,
        })
      }
    }
  }
  throw new Error.OperationalError({
    code: 'E_ICON_THEME_NOT_FOUND',
    message: `Icon theme "${iconThemeId}" not found in extensions folder`,
  })
}
