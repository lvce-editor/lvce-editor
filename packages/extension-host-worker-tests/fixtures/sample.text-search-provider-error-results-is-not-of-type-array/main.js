const textSearchProvider = {
  scheme: 'memfs',
  provideTextSearchResults(query) {
    return {
      type: vscode.TextSearchResultType.File,
      text: './index.txt',
      start: 0,
      end: 0,
      lineNumber: 0,
    }
  },
}

export const activate = () => {
  vscode.registerTextSearchProvider(textSearchProvider)
}
