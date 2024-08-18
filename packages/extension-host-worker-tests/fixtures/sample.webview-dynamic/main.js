const getDate = () => {
  return new Date().toLocaleTimeString()
}

const webViewProvider = {
  id: 'xyz',
  async setup() {
    return {
      date: getDate(),
    }
  },
  mounted() {
    const interval = setInterval(() => {
      this.setState((state) => {
        return {
          ...state,
          date: getDate(),
        }
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
