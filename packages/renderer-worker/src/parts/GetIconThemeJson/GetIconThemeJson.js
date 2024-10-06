import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetExtensions from '../GetExtensions/GetExtensions.js'
import * as FindMatchingIconThemeExtension from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'

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
  for (const webExtension of ExtensionMetaState.state.webExtensions) {
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
  const extensions = await GetExtensions.getExtensions()
  const iconTheme = FindMatchingIconThemeExtension.findMatchingIconThemeExtension(extensions, iconThemeId)
  if (!iconTheme) {
    return undefined
  }
  const iconThemePath = `${iconTheme.extensionPath}/${iconTheme.path}`
  const iconThemeContent = await FileSystem.readFile(iconThemePath)
  console.log({ iconThemeContent })
  return SharedProcess.invoke(SharedProcessCommandType.ExtensionHostGetIconThemeJson, /* iconThemeId */ iconThemeId)
}
