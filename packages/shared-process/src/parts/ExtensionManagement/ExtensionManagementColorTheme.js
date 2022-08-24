import * as Error from '../Error/Error.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as ExtensionManagement from './ExtensionManagement.js'

// TODO test this function
// TODO very similar with getIconTheme
export const getColorThemeJson = async (colorThemeId) => {
  const extensions = await ExtensionManagement.getThemeExtensions()
  for (const extension of extensions) {
    if (!extension.colorThemes) {
      continue
    }
    for (const colorTheme of extension.colorThemes) {
      if (colorTheme.id !== colorThemeId) {
        continue
      }
      const absolutePath = Path.join(extension.path, colorTheme.path)
      try {
        const json = await ReadJson.readJson(absolutePath)
        return json
      } catch (error) {
        throw new Error.OperationalError({
          cause: error,
          code: 'E_COLOR_THEME_COULD_NOT_BE_LOADED',
          message: `Failed to load color theme "${colorThemeId}"`,
        })
      }
    }
  }
  throw new Error.OperationalError({
    code: 'E_COLOR_THEME_NOT_FOUND',
    message: `Color theme "${colorThemeId}" not found in extensions folder`,
  })
}

const getColorThemeInfo = (extension) => {
  return extension.colorThemes || []
}

const getExtensionColorThemeNames = (extension) => {
  return extension.colorThemes || []
}

const getColorThemeId = (colorTheme) => {
  return colorTheme.id
}

// TODO should send names to renderer worker or names with ids?
export const getColorThemeNames = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemes = extensions.flatMap(getExtensionColorThemeNames)
  const colorThemeNames = colorThemes.map(getColorThemeId)
  return colorThemeNames
}

export const getColorThemes = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemes = extensions.flatMap(getColorThemeInfo)
  return colorThemes
}
