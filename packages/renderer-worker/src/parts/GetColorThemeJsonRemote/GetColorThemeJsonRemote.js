import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getColorThemeJson = (colorThemeId) => {
  return SharedProcess.invoke(/* ExtensionHost.getColorThemeJson */ 'ExtensionHost.getColorThemeJson', /* colorThemeId */ colorThemeId)
}
