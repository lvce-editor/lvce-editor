import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetColorThemeCssCached from '../GetColorThemeCssCached/GetColorThemeCssCached.js'
import * as GetColorThemeJson from '../GetColorThemeJson/GetColorThemeJson.js'

export const getColorThemeCssFromJson = async (colorThemeId, colorThemeJson) => {
  return ExtensionHostWorker.invoke('ColorTheme.getColorThemeCssFromJson', colorThemeId, colorThemeJson)
}

const getColorThemeCssNew = async (colorThemeId) => {
  const colorThemeJson = await GetColorThemeJson.getColorThemeJson(colorThemeId)
  const colorThemeCss = await getColorThemeCssFromJson(colorThemeId, colorThemeJson)
  return colorThemeCss
}

export const getColorThemeCss = (colorThemeId) => {
  return GetColorThemeCssCached.getColorThemeCssCached(colorThemeId, getColorThemeCssNew)
}
