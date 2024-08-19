const webViewProvider = {
  id: 'xyz',
  async create(webView) {
    return () => {}
  },
  commands: {
    handleClick() {
      console.log('clicked')
    },
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerWebViewProvider(webViewProvider)
}
