import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getWebViewPath = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView.path
    }
  }
  return ''
}
export const getIframeSrc = (webViews, webViewId, webViewPort) => {
  const webViewPath = getWebViewPath(webViews, webViewId)
  if (!webViewPath) {
    return undefined
  }
  let iframeSrc = webViewPath
  if (Platform.platform === PlatformType.Remote) {
    iframeSrc = `http://localhost:${webViewPort}`
  }
  return {
    frameAncestors: 'http://localhost:3000',
    iframeSrc,
  }
}
