import * as GetWebViewHtml from '../GetWebViewHtml/GetWebViewHtml.ts'

export const getIframeSrc = async (webView: any) => {
  const srcHtml = GetWebViewHtml.getWebViewHtml(webView)
  if (srcHtml) {
    const blob = new Blob([srcHtml], {
      type: 'text/html',
    })
    const url = URL.createObjectURL(blob) // TODO dispose
    return {
      srcDoc: '',
      iframeSrc: url,
      webViewRoot: '',
    }
  }
  return undefined
}
