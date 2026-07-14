import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'

export const getAssetDir = () => {
  return AssetDir.assetDir
}

export const getPlatform = () => {
  return Platform.getPlatform()
}
