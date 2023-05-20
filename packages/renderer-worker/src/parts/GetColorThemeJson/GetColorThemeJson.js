import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getColorThemeJsonFromSharedProcess = async (colorThemeId) => {
  return SharedProcess.invoke(/* ExtensionHost.getColorThemeJson */ 'ExtensionHost.getColorThemeJson', /* colorThemeId */ colorThemeId)
}

const getColorThemeUrlWeb = (colorThemeId) => {
  const assetDir = Platform.getAssetDir()
  return `${assetDir}/extensions/builtin.theme-${colorThemeId}/color-theme.json`
}

const getColorThemeJsonFromStaticFolder = (colorThemeId) => {
  const url = getColorThemeUrlWeb(colorThemeId)
  // TODO handle error ?
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

export const getColorThemeJson = (colorThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    return getColorThemeJsonFromStaticFolder(colorThemeId)
  }
  return getColorThemeJsonFromSharedProcess(colorThemeId)
}
