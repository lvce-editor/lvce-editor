const webViewProvider = {
  id: 'xyz',
  create(webView, uri) {},
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
