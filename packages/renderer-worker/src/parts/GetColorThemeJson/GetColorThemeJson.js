import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as Assert from '../Assert/Assert.js'

export const getColorThemeJson = (colorThemeId, platform, assetDir) => {
  Assert.string(colorThemeId)
  Assert.number(platform)
  Assert.string(assetDir)
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeJson', colorThemeId, platform, assetDir)
}
