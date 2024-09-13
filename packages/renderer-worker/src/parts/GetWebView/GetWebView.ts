export const getWebView = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView
    }
  }
  return undefined
}
