import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getDefaultBaseUrl = (webView: any) => {
  const { remotePath } = webView
  if (remotePath.endsWith('/index.html')) {
    return remotePath.slice(0, -'/index.html'.length)
  }
  return remotePath
}

const getBaseUrl = (webView: any, webViewPort: number) => {
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

export const getWebViewHtml = (webView: any, webViewPort: number): string => {
  const { elements } = webView
  const baseUrl = getBaseUrl(webView, webViewPort)
  const middle: string[] = []
  const csp = `default-src 'none'; script-src http://localhost:3002; style-src http://localhost:3002;`
  middle.push('<meta charset="utf-8">')
  middle.push(`<meta http-equiv="Content-Security-Policy" content="${csp}">`)
  for (const element of elements) {
    if (element.type === 'title') {
      middle.push(`<title>${element.value}</title>`)
    } else if (element.type === 'script') {
      middle.push(`<script type="module" src="http://localhost:3002${AssetDir.assetDir}/preview-injected.js">`)
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
