import * as Command from '../Command/Command.js'
import * as GetColorThemeJson from '../GetColorThemeJson/GetColorThemeJson.js'

export const getColorThemeCssFromJson = async (colorThemeId, colorThemeJson) => {
  const colorThemeCss = await Command.execute(
    /* ColorThemeFromJson.createColorThemeFromJson */ 'ColorThemeFromJson.createColorThemeFromJson',
    /* colorThemeId */ colorThemeId,
    /* colorThemeJson */ colorThemeJson,
  )
  return colorThemeCss
  // TODO generate color theme from jsonc
}

export const getColorThemeCss = async (colorThemeId) => {
  const colorThemeJson = await GetColorThemeJson.getColorThemeJson(colorThemeId)
  const colorThemeCss = await getColorThemeCssFromJson(colorThemeId, colorThemeJson)
  return colorThemeCss
}
