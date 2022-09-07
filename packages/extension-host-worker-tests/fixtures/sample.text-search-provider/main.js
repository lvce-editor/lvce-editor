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
            rangeStart: 11,
            rangeEnd: 14,
          },
        ],
      ],
    ]
  },
}

export const activate = () => {
  vscode.registerTextSearchProvider(textSearchProvider)
}
