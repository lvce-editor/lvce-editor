import * as GetBlobUrl from '../GetBlobUrl/GetBlobUrl.ts'
import * as GetWebViewHtml from '../GetWebViewHtml/GetWebViewHtml.ts'

export const getIframeSrc = async (webView: any, locationOrigin: string) => {
  const srcHtml = GetWebViewHtml.getWebViewHtml(webView, locationOrigin)
  if (srcHtml) {
    const blobUrl = GetBlobUrl.getBlobUrl(srcHtml, 'text/html')
    return {
      srcDoc: '',
      iframeSrc: blobUrl,
      webViewRoot: '',
    }
  }
  return undefined
}
