const webViewProvider = {
  id: 'xyz',
  async create(webView) {
    const initialDate = new Date().toLocaleTimeString()
    await webView.invoke('setDate', initialDate)
    const interval = setInterval(async () => {
      const date = new Date().toLocaleTimeString()
      await webView.invoke('setDate', date)
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
