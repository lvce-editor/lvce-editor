import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const getColorThemeJson = (colorThemeId) => {
  return ExtensionHostWorker.invoke('ColorTheme.getColorThemeJson', colorThemeId)
}
