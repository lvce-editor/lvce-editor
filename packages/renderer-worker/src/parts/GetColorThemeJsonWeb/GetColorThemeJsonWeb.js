import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'

const getColorThemeUrlWeb = (colorThemeId) => {
  return `${AssetDir.assetDir}/extensions/builtin.theme-${colorThemeId}/color-theme.json`
}

export const getColorThemeJson = (colorThemeId) => {
  const url = getColorThemeUrlWeb(colorThemeId)
  // TODO handle error ?
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}
