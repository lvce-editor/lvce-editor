import * as Command from '../Command/Command.js'
import * as GetColorThemeJson from '../GetColorThemeJson/GetColorThemeJson.js'
import * as GetColorThemeCssCached from '../GetColorThemeCssCached/GetColorThemeCssCached.js'

export const getColorThemeCssFromJson = async (colorThemeId, colorThemeJson) => {
  const colorThemeCss = await Command.execute(
    /* ColorThemeFromJson.createColorThemeFromJson */ 'ColorThemeFromJson.createColorThemeFromJson',
    /* colorThemeId */ colorThemeId,
    /* colorThemeJson */ colorThemeJson,
  )
  return colorThemeCss
  // TODO generate color theme from jsonc
}

const getColorThemeCssNew = async (colorThemeId) => {
  const colorThemeJson = await GetColorThemeJson.getColorThemeJson(colorThemeId)
  const colorThemeCss = await getColorThemeCssFromJson(colorThemeId, colorThemeJson)
  return colorThemeCss
}

export const getColorThemeCss = (colorThemeId) => {
  return GetColorThemeCssCached.getColorThemeCssCached(colorThemeId, getColorThemeCssNew)
}
