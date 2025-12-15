import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

export const getColorThemeJson = (colorThemeId) => {
  const platform = Platform.getPlatform()
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeJson', colorThemeId, platform, AssetDir.assetDir)
}
