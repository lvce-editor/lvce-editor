import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getColorThemeNames = async () => {
  if (Platform.platform === PlatformType.Web) {
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}/config/themes.json`
    return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
  }
  return SharedProcess.invoke(/* ExtensionHost.getColorThemeNames */ 'ExtensionHost.getColorThemeNames')
}
