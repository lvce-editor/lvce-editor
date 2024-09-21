import * as CreateLocalHostUrl from '../CreateLocalHostUrl/CreateLocalHostUrl.ts'
import * as GetWebViewHtml from '../GetWebViewHtml/GetWebViewHtml.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Scheme from '../Scheme/Scheme.ts'

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

export const getIframeSrcRemote = (webViews, webViewPort, webViewId, locationProtocol, locationHost, isGitpod, root) => {
  const webView = getWebView(webViews, webViewId)
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
  let iframeContent = GetWebViewHtml.getWebViewHtml('', '', webView.elements)
  // TODO either
  // - load webviews the same as in web using blob urls
  // - load webviews from a pattern like /webviews/:id/:fileName
  iframeContent = iframeContent.replaceAll('/media/', '/').replaceAll('//', '/')
  return {
    srcDoc: '',
    iframeSrc,
    webViewRoot,
    iframeContent,
  }
}
