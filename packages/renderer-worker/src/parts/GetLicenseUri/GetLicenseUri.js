import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getLicenseUri = async (platform = Platform.getPlatform(), assetDir = AssetDir.assetDir) => {
  if (platform === PlatformType.Web) {
    return `${assetDir}/LICENSE`
  }
  const rootUri = await SharedProcess.invoke('Platform.getRootUri')
  return `${rootUri.replace(/\/$/, '')}/LICENSE`
}
