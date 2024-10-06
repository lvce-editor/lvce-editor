import * as AssetDir from '../AssetDir/AssetDir.js'

export const getIconThemeUrl = (iconThemeId) => {
  return `${AssetDir.assetDir}/extensions/builtin.${iconThemeId}/icon-theme.json`
}
