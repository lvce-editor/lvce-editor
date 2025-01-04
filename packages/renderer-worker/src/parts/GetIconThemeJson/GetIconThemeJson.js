import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const getIconThemeJson = async (iconThemeId) => {
  return ExtensionHostWorker.invoke('IconTheme.getJson', iconThemeId)
}
