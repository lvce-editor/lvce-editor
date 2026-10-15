import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RuntimeConfig from '../RuntimeConfig/RuntimeConfig.ts'

const getAssetDir = () => {
  if (typeof RuntimeConfig.runtimeConfig.assetDir === 'string') {
    return RuntimeConfig.runtimeConfig.assetDir
  }
  // @ts-ignore
  if (typeof ASSET_DIR !== 'undefined') {
    // @ts-ignore
    return ASSET_DIR
  }
  if (Platform.getPlatform() === PlatformType.Electron) {
    return ''
  }
  return ''
}

export const assetDir = getAssetDir()
