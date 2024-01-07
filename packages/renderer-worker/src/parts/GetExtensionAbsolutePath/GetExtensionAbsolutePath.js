import * as AssetDir from '../AssetDir/AssetDir.js'

export const getExtensionAbsolutePath = (id, isWeb, isBuiltin, path, relativePath, origin) => {
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
  if (isBuiltin) {
    return `${AssetDir.assetDir}/extensions/${id}/${relativePath}`
  }
  return new URL('/remote' + path + '/' + relativePath, origin).toString()
}
