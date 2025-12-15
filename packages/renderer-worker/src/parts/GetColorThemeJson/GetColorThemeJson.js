import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'

export const getColorThemeJson = (colorThemeId) => {
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeJson', colorThemeId)
}
