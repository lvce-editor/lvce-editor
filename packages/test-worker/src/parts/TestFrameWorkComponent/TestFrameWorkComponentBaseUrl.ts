import * as AssetDir from '../AssetDir/AssetDir.ts'

export const getBaseUrl = () => {
  return `${location.origin}/${AssetDir.assetDir}`
}
