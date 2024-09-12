import * as AssetDir from '../AssetDir/AssetDir.js'
import * as CreateLocalHostUrl from '../CreateLocalHostUrl/CreateLocalHostUrl.ts'
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

const getDefaultBaseUrl = (webView) => {
  const { remotePath } = webView
  if (remotePath.endsWith('/index.html')) {
    return remotePath.slice(0, -'/index.html'.length)
  }
  return remotePath
}

const getBaseUrl = (webView, webViewPort) => {
  const defaultBaseUrl = getDefaultBaseUrl(webView)
  if (Platform.platform === PlatformType.Web) {
    return defaultBaseUrl
  }
  if (Platform.platform === PlatformType.Remote) {
    return `http://localhost:${webViewPort}/${defaultBaseUrl}`
  }
  if (Platform.platform === PlatformType.Electron) {
    // TODO
    return defaultBaseUrl
  }
  throw new Error(`unsupported platform`)
}

const createSrcDoc = (webView, webViewPort) => {
  const { elements } = webView
  const baseUrl = getBaseUrl(webView, webViewPort)
  const middle: string[] = []
  for (const element of elements) {
    if (element.type === 'title') {
      middle.push(`<title>${element.value}</title>`)
    } else if (element.type === 'script') {
      middle.push(`<script type="module" src="${AssetDir.assetDir}/preview-injected.js">`)
      middle.push(`<script type="module" src="${baseUrl}/${element.path}"></script>`)
    } else if (element.type === 'css') {
      middle.push(`<link rel="stylesheet" href="${baseUrl}/${element.path}" />`)
    }
  }
  const middleHtml = middle.join('\n    ')
  let html = `<!DOCTYPE html>
<html>
  <head>
    ${middleHtml}
  </head>
</html>
`
  return html
}

export const getIframeSrc = (webViews, webViewId, webViewPort, root, isGitpod, locationProtocol, locationHost) => {
  try {
    const webView = getWebView(webViews, webViewId)
    if (!webView) {
      return undefined
    }
    const srcDoc = createSrcDoc(webView, webViewPort)
    if (srcDoc) {
      return {
        srcDoc,
        iframeSrc: '',
        webViewRoot: '',
      }
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
