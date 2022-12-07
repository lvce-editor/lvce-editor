const textSearchProvider = {
  scheme: 'memfs',
  provideTextSearchResults(query) {
    return []
  },
}

export const activate = () => {
  vscode.registerTextSearchProvider(textSearchProvider)
}
