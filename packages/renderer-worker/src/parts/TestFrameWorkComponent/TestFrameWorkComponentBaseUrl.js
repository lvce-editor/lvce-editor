import * as AssetDir from '../AssetDir/AssetDir.js'

export const getBaseUrl = () => {
  return `${location.origin}/${AssetDir.assetDir}`
}
