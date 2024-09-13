import * as AssetDir from '../AssetDir/AssetDir.js'

const getDefaultBaseUrl = (webView: any) => {
  const { remotePath, path } = webView
  if (remotePath) {
    if (remotePath.endsWith('/index.html')) {
      return remotePath.slice(0, -'/index.html'.length)
    }
    return remotePath
  }
  if (path) {
    if (path.endsWith('/index.html')) {
      return path.slice(0, -'/index.html'.length)
    }
    return path
  }
  return ''
}

const getBaseUrl = (webView: any) => {
  const defaultBaseUrl = getDefaultBaseUrl(webView)
  return defaultBaseUrl
}

export const getWebViewHtml = (webView: any): string => {
  const { elements } = webView
  const baseUrl = getBaseUrl(webView)
  const middle: string[] = []
  const csp = `default-src 'none'; script-src http://localhost:3002; style-src http://localhost:3002;`
  middle.push('<meta charset="utf-8">')
  middle.push(`<meta http-equiv="Content-Security-Policy" content="${csp}">`)
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
