import * as AssetDir from '../AssetDir/AssetDir.ts'

export const getFontUrl = (relativePath) => {
  const fontUrl = `url('${AssetDir.assetDir}${relativePath}')`
  return fontUrl
}
