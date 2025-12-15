import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'

export const getColorThemeNames = async () => {
  return ExtensionManagementWorker.invoke('Extensions.getColorThemeNames')
}
