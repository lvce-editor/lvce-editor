import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FindMatchingIconThemeExtension from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'
import * as GetExtensions from '../GetExtensions/GetExtensions.js'
import * as GetIconThemeUrl from '../GetIconThemeUrl/GetIconThemeUrl.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getIconThemeJson = async (iconThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    const url = GetIconThemeUrl.getIconThemeUrl(iconThemeId)
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
  const iconThemeJson = await FileSystem.readJson(iconThemePath)
  return {
    extensionPath: iconTheme.extensionPath,
    json: iconThemeJson,
  }
}
