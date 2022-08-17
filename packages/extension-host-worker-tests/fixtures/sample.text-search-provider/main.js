const textSearchProvider = {
  scheme: 'xyz',
  provideTextSearchResults(query) {
    return [
      [
        './index.txt',
        {
          absoluteOffset: 208,
          preview: '    <title>Document</title>\n',
        },
      ],
    ]
  },
}

export const activate = () => {
  vscode.registerTextSearchProvider(textSearchProvider)
}
