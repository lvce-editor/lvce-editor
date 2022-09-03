const textSearchProvider = {
  scheme: 'memfs',
  provideTextSearchResults(query) {
    return [
      [
        './index.txt',
        [
          {
            absoluteOffset: 208,
            preview: '    <title>Document</title>',
          },
        ],
      ],
    ]
  },
}

export const activate = () => {
  vscode.registerTextSearchProvider(textSearchProvider)
}
