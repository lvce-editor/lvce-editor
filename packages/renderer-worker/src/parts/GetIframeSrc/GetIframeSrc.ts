import * as CreateUrl from '../CreateUrl/CreateUrl.ts'
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

export const getIframeSrc = (webViews, webViewId, webViewPort, root, isGitpod, locationProtocol, locationHost) => {
  try {
    const webViewUri = getWebViewUri(webViews, webViewId)
    if (!webViewUri) {
      return undefined
    }
    console.log({ webViewUri })
    let iframeSrc = webViewUri
    let webViewRoot = webViewUri
    if (Platform.platform === PlatformType.Remote) {
      const relativePath = new URL(webViewUri).pathname.replace('/index.html', '')
      console.log({ relativePath })
      if (webViewUri.startsWith('file://')) {
        // ignore
        webViewRoot = webViewUri.slice('file://'.length)
      } else {
        webViewRoot = root + relativePath
      }
      if (isGitpod) {
        iframeSrc = CreateUrl.createUrl(locationProtocol, locationHost.replace('3000', webViewPort))
      } else {
        iframeSrc = `http://localhost:${webViewPort}`
      }
    }
    return {
      iframeSrc,
      webViewRoot,
    }
  } catch (error) {
    throw new VError(error, `Failed to construct webview iframe src`)
  }
}
