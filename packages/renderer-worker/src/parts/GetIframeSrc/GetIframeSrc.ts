import * as Base64 from '../Base64/Base64.js'
import * as CreateLocalHostUrl from '../CreateLocalHostUrl/CreateLocalHostUrl.ts'
import * as GetWebViewHtml from '../GetWebViewHtml/GetWebViewHtml.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Scheme from '../Scheme/Scheme.ts'
import { VError } from '../VError/VError.js'

const getWebView = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView
    }
  }
  return undefined
}

const getWebViewPath = (webViews, webViewId) => {
  const webView = getWebView(webViews, webViewId)
  if (!webView) {
    return ''
  }
  return webView.path
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

export const getIframeSrc = async (webViews, webViewId, webViewPort, root, isGitpod, locationProtocol, locationHost) => {
  try {
    const webView = getWebView(webViews, webViewId)
    if (!webView) {
      return undefined
    }
    const srcHtml = GetWebViewHtml.getWebViewHtml(webView, webViewPort)
    if (srcHtml) {
      const base64 = await Base64.encode(srcHtml)
      const dataUrl = `data:text/html;base64,${base64}`
      console.log({ dataUrl })
      return {
        srcDoc: '',
        iframeSrc: dataUrl,
        webViewRoot: '',
      }
    }
    const webViewUri = getWebViewUri(webViews, webViewId)
    if (!webViewUri) {
      return undefined
    }
    let iframeSrc = webViewUri
    let webViewRoot = webViewUri
    if (Platform.platform === PlatformType.Electron) {
      const relativePath = new URL(webViewUri).pathname.replace('/index.html', '')
      iframeSrc = `${Scheme.WebView}://-${relativePath}/`
      // TODO
    } else if (Platform.platform === PlatformType.Remote) {
      const relativePath = new URL(webViewUri).pathname.replace('/index.html', '')
      if (webViewUri.startsWith('file://')) {
        // ignore
        webViewRoot = webViewUri.slice('file://'.length).replace('/index.html', '')
      } else {
        webViewRoot = root + relativePath
      }
      iframeSrc = CreateLocalHostUrl.createLocalHostUrl(locationProtocol, locationHost, isGitpod, webViewPort)
    }
    return {
      srcDoc: '',
      iframeSrc,
      webViewRoot,
    }
  } catch (error) {
    throw new VError(error, `Failed to construct webview iframe src`)
  }
}
