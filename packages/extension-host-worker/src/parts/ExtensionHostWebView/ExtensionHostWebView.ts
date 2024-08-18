const webViews = Object.create(null)
const webViewProviders = Object.create(null)

// TODO pass uuid to allow having multiple webviews open at the same time
export const createWebView = (id, port) => {
  const provider = webViewProviders[id]
  if (!provider) {
    console.log({ webViewProviders })
    throw new Error(`webview provider ${id} not found`)
  }
  const rpc = {
    invoke(method, ...params) {
      // TODO return promise with result
      port.postMessage({
        jsonrpc: '2.0',
        method,
        params,
      })
    },
  }
  webViews[id] = rpc
  provider.create(rpc)
}

export const disposeWebView = (id) => {
  // TODO race condition
  // const webView=webViews[id]
}

export const registerWebViewProvider = (provider) => {
  webViewProviders[provider.id] = provider
}
