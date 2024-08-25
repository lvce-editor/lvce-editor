import * as CreateUrl from '../CreateUrl/CreateUrl.ts'
import * as IsGitpod from '../IsGitpod/IsGitpod.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import { VError } from '../VError/VError.js'

const getWebViewPath = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView.path
    }
  }
  return ''
}

const getWebViewUri = (webViews, webViewId) => {
  const webViewPath = getWebViewPath(webViews, webViewId)
  if (!webViewPath) {
    return ''
  }
  if (webViewPath.startsWith('/')) {
    // TODO make it work on windows also
    return `file://${webViewPath}`
  }
  return webViewPath
}

export const getIframeSrc = (webViews, webViewId, webViewPort, root) => {
  try {
    const webViewUri = getWebViewUri(webViews, webViewId)
    if (!webViewUri) {
      return undefined
    }
    let iframeSrc = webViewUri
    let webViewRoot = webViewUri
    if (Platform.platform === PlatformType.Remote) {
      const relativePath = new URL(webViewUri).pathname.replace('/index.html', '')
      webViewRoot = root + relativePath
      if (IsGitpod.isGitpod) {
        iframeSrc = CreateUrl.createUrl(location.protocol, location.host.replace('3000', webViewPort))
      } else {
        iframeSrc = `http://localhost:${webViewPort}`
      }
    }
    if (IsGitpod.isGitpod) {
      iframeSrc = iframeSrc
    }
    const frameAncestors = CreateUrl.createUrl(location.protocol, location.host)
    return {
      frameAncestors,
      iframeSrc,
      webViewRoot,
    }
  } catch (error) {
    throw new VError(error, `Failed to construct webview iframe src`)
  }
}
