import * as GetIframeSrcRemote from '../GetIframeSrcRemote/GetIframeSrcRemote.js'
import * as GetIframeSrcWeb from '../GetIframeSrcWeb/GetIframeSrcWeb.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import { VError } from '../VError/VError.js'

const getWebView = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView
    }
  }
  return undefined
}

export const getIframeSrc = async (webViews, webViewId, webViewPort, root, isGitpod, locationProtocol, locationHost) => {
  try {
    const webView = getWebView(webViews, webViewId)
    if (Platform.platform === PlatformType.Web) {
      return GetIframeSrcWeb.getIframeSrc(webView, webViewPort)
    }
    return GetIframeSrcRemote.getIframeSrcRemote(webViews, webViewPort, webViewId, locationProtocol, locationHost, isGitpod, root)
  } catch (error) {
    throw new VError(error, `Failed to construct webview iframe src`)
  }
}
