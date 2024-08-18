const webViewProvider = {
  id: 'xyz',
  async create(webView) {
    const date = new Date().toLocaleTimeString()
    await webView.invoke({
      jsonrpc: '2.0',
      method: 'setDate',
      params: [date],
    })
    const interval = setInterval(async () => {
      await webView.invoke({
        jsonrpc: '2.0',
        method: 'setDate',
        params: [date],
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
