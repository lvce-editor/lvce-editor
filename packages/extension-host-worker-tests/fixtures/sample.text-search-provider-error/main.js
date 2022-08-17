const textSearchProvider = {
  languageId: 'xyz',
  provideTextSearchResults(query) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerTextSearchProvider(textSearchProvider)
}
