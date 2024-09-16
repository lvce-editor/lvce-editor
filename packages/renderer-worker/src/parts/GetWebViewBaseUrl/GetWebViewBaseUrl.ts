const getDefaultBaseUrl = (webView: any) => {
  const { remotePath, path } = webView
  if (remotePath) {
    if (remotePath.endsWith('/index.html')) {
      return remotePath.slice(0, -'/index.html'.length)
    }
    return remotePath
  }
  if (path) {
    if (path.endsWith('/index.html')) {
      return path.slice(0, -'/index.html'.length)
    }
    return path
  }
  return ''
}

export const getWebViewBaseUrl = (webView: any) => {
  const defaultBaseUrl = getDefaultBaseUrl(webView)
  return defaultBaseUrl
}
