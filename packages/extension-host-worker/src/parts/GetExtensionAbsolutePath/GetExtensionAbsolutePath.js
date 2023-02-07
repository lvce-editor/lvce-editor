export const getExtensionAbsolutePath = (isWeb, path, relativePath, origin) => {
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
  return new URL('/remote' + path + '/' + relativePath, origin).toString()
}
