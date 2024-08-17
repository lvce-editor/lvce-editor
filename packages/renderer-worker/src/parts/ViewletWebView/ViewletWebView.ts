import * as GetWebViews from '../GetWebViews/GetWebViews.ts'

export const create = (id, uri) => {
  return {
    id,
    uri,
    iframeSrc: '',
  }
}

const getIframeSrc = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView.path
    }
  }
  return ''
}

export const loadContent = async (state) => {
  const { uri } = state
  const webViewId = uri.slice('webview://'.length)
  const webViews = await GetWebViews.getWebViews()
  const iframeSrc = getIframeSrc(webViews, webViewId)
  console.log({ iframeSrc, webViews, webViewId })
  // await ExtensionHostManagement.activateByEvent(`onWebView:${webViewId}`)
  // await ExtensionHostWorker.invoke
  return {
    ...state,
    iframeSrc,
  }
}
