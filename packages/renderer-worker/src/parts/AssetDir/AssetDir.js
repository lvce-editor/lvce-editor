import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getAssetDir = () => {
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
