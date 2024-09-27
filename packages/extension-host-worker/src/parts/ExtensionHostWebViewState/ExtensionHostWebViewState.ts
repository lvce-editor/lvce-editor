const webViews = Object.create(null)
const webViewProviders = Object.create(null)

export const getProvider = (providerId) => {
  return webViewProviders[providerId]
}

export const setProvider = (providerId, provider) => {
  webViewProviders[providerId] = provider
}

export const getWebView = (id) => {
  return webViews[id]
}

export const setWebView = (id, webView) => {
  webViews[id] = webView
}
