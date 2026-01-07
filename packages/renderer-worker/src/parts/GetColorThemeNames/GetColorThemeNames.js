import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'

export const getColorThemeNames = async (assetDir, platform) => {
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeNames', assetDir, platform)
}
