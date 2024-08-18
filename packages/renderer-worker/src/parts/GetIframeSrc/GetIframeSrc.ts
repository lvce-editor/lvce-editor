import * as IsGitpod from '../IsGitpod/IsGitpod.ts'
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
  if (Platform.platform === PlatformType.Remote) {
    const relativePath = new URL(webViewPath).pathname.replace('/index.html', '')
    webViewRoot = root + relativePath
    if (IsGitpod.isGitpod) {
      iframeSrc = `https://${location.host.replace('3000', webViewPort)}`
    } else {
      iframeSrc = `http://localhost:${webViewPort}`
    }
  }
  if (IsGitpod.isGitpod) {
    iframeSrc = iframeSrc
  }
  const frameAncestors = location.protocol + '//' + location.host
  return {
    frameAncestors,
    iframeSrc,
    webViewRoot,
  }
}
