const webViewProvider = {
  id: 'xyz',
  getHtmlPath() {
    return new URL('./index.html', import.meta.url).toString()
  },
}

export const activate = () => {
  console.log('activate')
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
