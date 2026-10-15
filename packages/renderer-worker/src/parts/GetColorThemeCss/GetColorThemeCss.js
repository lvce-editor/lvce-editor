import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetColorThemeCssCached from '../GetColorThemeCssCached/GetColorThemeCssCached.js'
import * as GetColorThemeJson from '../GetColorThemeJson/GetColorThemeJson.js'
import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

export const getColorThemeCssFromJson = async (colorThemeId, colorThemeJson) => {
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeCssFromJson', colorThemeId, colorThemeJson)
}

const getColorThemeCssNew = async (colorThemeId, forceReload = false) => {
  const platform = Platform.getPlatform()
  const colorThemeJson = await GetColorThemeJson.getColorThemeJson(colorThemeId, platform, AssetDir.assetDir, forceReload)
  const colorThemeCss = await getColorThemeCssFromJson(colorThemeId, colorThemeJson)
  return colorThemeCss
}

export const getColorThemeCss = (colorThemeId, forceReload = false) => {
  return GetColorThemeCssCached.getColorThemeCssCached(colorThemeId, getColorThemeCssNew, forceReload)
}
