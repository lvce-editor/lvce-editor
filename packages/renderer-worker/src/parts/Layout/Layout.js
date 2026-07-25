import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const getApplicationName = () => {
  return PlatformPaths.getApplicationName()
}

export const getAssetDir = () => {
  return AssetDir.assetDir
}

export const getPlatform = () => {
  return Platform.getPlatform()
}
