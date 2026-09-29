export const getRemoteSrc = (uri) => {
  const isWindowsPath = /^[a-zA-Z]:[\\/]/.test(uri)
  if (!isWindowsPath) {
    try {
      const url = new URL(uri)
      if (url.protocol !== 'file:') {
        return uri
      }
      uri = url.pathname
    } catch {
      // The URI is a file system path.
    }
  }
  const normalizedUri = uri.replaceAll('\\', '/')
  return normalizedUri.startsWith('/') ? `/remote${normalizedUri}` : `/remote/${normalizedUri}`
}
