import * as AssetDir from '../AssetDir/AssetDir.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getExtensionAbsolutePath = (id, isWeb, isBuiltin, path, relativePath, origin, platform) => {
  if (path.startsWith('http')) {
    if (path.endsWith('/')) {
      return new URL(relativePath, path).toString()
    }
    return new URL(relativePath, path + '/').toString()
  }
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  if (isWeb) {
    return path + '/' + relativePath
  }
  if (platform === PlatformType.Web) {
    return path + '/' + relativePath
  }
  if (isBuiltin) {
    return `${AssetDir.assetDir}/extensions/${id}/${relativePath}`
  }
  return new URL('/remote' + path + '/' + relativePath, origin).toString()
}
