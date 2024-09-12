import * as CreateUrl from '../CreateUrl/CreateUrl.ts'
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

export const getIframeSrc = (webViews, webViewId, webViewPort, root, isGitpod, locationProtocol, locationHost) => {
  try {
    const webView = getWebView(webViews, webViewId)
    if (!webView) {
      return undefined
    }
    console.log({ webView })
    const webViewUri = getWebViewUri(webViews, webViewId)
    if (!webViewUri) {
      return undefined
    }
    console.log({ webViewUri })
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
