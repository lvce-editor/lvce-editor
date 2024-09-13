import * as GetIframeSrcRemote from '../GetIframeSrcRemote/GetIframeSrcRemote.ts'
import * as GetIframeSrcWeb from '../GetIframeSrcWeb/GetIframeSrcWeb.ts'
import * as GetWebView from '../GetWebView/GetWebView.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import { VError } from '../VError/VError.js'

export const getIframeSrc = async (webViews, webViewId, webViewPort, root, isGitpod, locationProtocol, locationHost) => {
  try {
    const webView = GetWebView.getWebView(webViews, webViewId)
    if (Platform.platform === PlatformType.Web) {
      return GetIframeSrcWeb.getIframeSrc(webView, webViewPort)
    }
    return GetIframeSrcRemote.getIframeSrcRemote(webViews, webViewPort, webViewId, locationProtocol, locationHost, isGitpod, root)
  } catch (error) {
    throw new VError(error, `Failed to construct webview iframe src`)
  }
}
