import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'

export const getColorThemeNames = async (assetDir = AssetDir.assetDir, platform = Platform.getPlatform()) => {
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeNames', assetDir, platform)
}
