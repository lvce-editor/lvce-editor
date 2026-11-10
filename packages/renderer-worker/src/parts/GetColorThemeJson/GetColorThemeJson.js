import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as Assert from '../Assert/Assert.ts'

export const getColorThemeJson = (colorThemeId, platform, assetDir, forceReload = false) => {
  Assert.string(colorThemeId)
  Assert.number(platform)
  Assert.string(assetDir)
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeJson', colorThemeId, platform, assetDir, forceReload)
}
