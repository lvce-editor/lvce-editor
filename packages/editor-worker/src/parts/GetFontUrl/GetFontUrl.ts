import * as AssetDir from '../AssetDir/AssetDir.js'

export const getFontUrl = (relativePath) => {
  const fontUrl = `url('${AssetDir.assetDir}${relativePath}')`
  return fontUrl
}
