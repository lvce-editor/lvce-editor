const webViewProvider = {
  getHtmlPath() {
    return new URL('./index.html', import.meta.url).toString()
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
