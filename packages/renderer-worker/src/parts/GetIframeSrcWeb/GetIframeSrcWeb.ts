import * as Base64 from '../Base64/Base64.js'
import * as GetWebViewHtml from '../GetWebViewHtml/GetWebViewHtml.ts'

export const getIframeSrc = async (webView: any, webViewPort: number) => {
  const srcHtml = GetWebViewHtml.getWebViewHtml(webView, webViewPort)
  if (srcHtml) {
    const base64 = await Base64.encode(srcHtml)
    const dataUrl = `data:text/html;base64,${base64}`
    return {
      srcDoc: '',
      iframeSrc: dataUrl,
      webViewRoot: '',
    }
  }
  return undefined
}
