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
export const getIframeSrc = (webViews, webViewId, webViewPort, root) => {
  const webViewPath = getWebViewPath(webViews, webViewId)
  if (!webViewPath) {
    return undefined
  }
  let iframeSrc = webViewPath
  let webViewRoot = webViewPath

  console.log({ webViewPath })
  if (Platform.platform === PlatformType.Remote) {
    const relativePath = new URL(webViewPath).pathname.replace('./index.html', '')
    iframeSrc = `http://localhost:${webViewPort}`

    webViewRoot = root + relativePath
  }
  return {
    frameAncestors: 'http://localhost:3000',
    iframeSrc,
    webViewRoot,
  }
}
