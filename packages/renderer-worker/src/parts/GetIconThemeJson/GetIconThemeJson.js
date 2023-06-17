import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

const getIconThemeUrl = (iconThemeId) => {
  return `${AssetDir.assetDir}/extensions/builtin.${iconThemeId}/icon-theme.json`
}

export const getIconThemeJson = async (iconThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    const url = getIconThemeUrl(iconThemeId)
    const json = await Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
    return {
      json,
      extensionPath: `${AssetDir.assetDir}/extensions/builtin.${iconThemeId}`,
    }
  }
  for (const webExtension of ExtensionMeta.state.webExtensions) {
    if (webExtension.iconThemes) {
      for (const iconTheme of webExtension.iconThemes) {
        // TODO handle error when icon theme path is not of type string
        const iconThemeUrl = `${webExtension.path}/${iconTheme.path}`
        const json = await Command.execute('Ajax.getJson', iconThemeUrl)
        return {
          json,
          extensionPath: webExtension.path,
        }
      }
    }
  }
  return SharedProcess.invoke(SharedProcessCommandType.ExtensionHostGetIconThemeJson, /* iconThemeId */ iconThemeId)
}
