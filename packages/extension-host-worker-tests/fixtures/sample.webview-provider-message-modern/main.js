const webViewProvider = {
  id: 'xyz',
  async create(webView, uri) {
    const count = await webView.invoke('getCount')
    const newCount = count + 1
    await webView.invoke('setCount', newCount)
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
