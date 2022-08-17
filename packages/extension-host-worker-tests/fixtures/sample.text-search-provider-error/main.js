const textSearchProvider = {
  scheme: 'memfs',
  provideTextSearchResults(query) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerTextSearchProvider(textSearchProvider)
}
