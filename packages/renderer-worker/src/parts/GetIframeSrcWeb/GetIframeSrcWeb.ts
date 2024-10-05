import * as GetBlobUrl from '../GetBlobUrl/GetBlobUrl.ts'
import * as IframeWorker from '../IframeWorker/IframeWorker.ts'

export const getIframeSrc = async (webView: any, locationOrigin: string) => {
  const baseUrl = await IframeWorker.invoke('WebView.getBaseUrl', webView)
  const srcHtml = await IframeWorker.invoke('WebView.getHtml', baseUrl, locationOrigin, webView.elements)
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
