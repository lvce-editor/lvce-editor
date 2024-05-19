import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const getAssetDir = () => {
  // @ts-expect-error
  if (typeof ASSET_DIR !== 'undefined') {
    // @ts-expect-error
    return ASSET_DIR
  }
  if (Platform.platform === PlatformType.Electron) {
    return '../../../../..'
  }
  return ''
}

export const assetDir = getAssetDir()
