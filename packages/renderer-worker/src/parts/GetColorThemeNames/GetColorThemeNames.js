import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const getColorThemeNames = async () => {
  return ExtensionHostWorker.invoke('ColorTheme.getColorThemeNames')
}
