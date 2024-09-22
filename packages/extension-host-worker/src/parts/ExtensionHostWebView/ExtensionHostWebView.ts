const webViews = Object.create(null)
const webViewProviders = Object.create(null)

// TODO pass uuid to allow having multiple webviews open at the same time
export const createWebView = async (providerId, port, uri) => {
  const provider = webViewProviders[providerId]
  if (!provider) {
    throw new Error(`webview provider ${providerId} not found`)
  }

  // TODO cancel promise when webview is disposed before sending message
  // TODO handle case when webview doesn't send ready message
  // TODO handle error
  const firstMessage = await new Promise((resolve) => {
    port.onmessage = resolve
  })
  // @ts-ignore
  if (firstMessage.data !== 'ready') {
    // TODO handle error
  }

  // TODO use ipc module
  const handlePortMessage = async (event) => {
    const { data, target } = event
    const { method, params, id } = data
    if (provider && provider.commands && provider.commands[method]) {
      const fn = provider.commands[method]
      const result = await fn(...params)
      if (id) {
        target.postMessage({
          jsonrpc: '2.0',
          id,
          result,
        })
      }
    }
  }

  port.onmessage = handlePortMessage
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
  webViews[providerId] = rpc
  provider.create(rpc, uri)
}

export const disposeWebView = (id) => {
  // TODO race condition
  // const webView=webViews[id]
}

export const registerWebViewProvider = (provider) => {
  webViewProviders[provider.id] = provider
}
