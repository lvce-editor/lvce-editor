import * as GetBlobUrl from '../GetBlobUrl/GetBlobUrl.ts'
import * as GetWebViewBaseUrl from '../GetWebViewBaseUrl/GetWebViewBaseUrl.ts'
import * as GetWebViewHtml from '../GetWebViewHtml/GetWebViewHtml.ts'

export const getIframeSrc = (webView: any, locationOrigin: string) => {
  const baseUrl = GetWebViewBaseUrl.getWebViewBaseUrl(webView)
  const srcHtml = GetWebViewHtml.getWebViewHtml(baseUrl, locationOrigin, webView.elements)
  if (srcHtml) {
    const blobUrl = GetBlobUrl.getBlobUrl(srcHtml, 'text/html')
    return {
      srcDoc: '',
      iframeSrc: blobUrl,
      webViewRoot: '',
      iframeContent: '',
    }
  }
  return undefined
}
