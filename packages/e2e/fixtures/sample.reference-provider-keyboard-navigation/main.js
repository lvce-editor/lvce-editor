const referenceProvider = {
  languageId: 'javascript',
  provideReferences(textDocument, offset) {
    return [
      {
        uri: '/test/a.js',
        lineText: 'test-1',
        startOffset: 0,
        endOffset: 0,
      },
      {
        uri: '/test/b.js',
        lineText: 'test-2',
        startOffset: 0,
        endOffset: 0,
      },
      {
        uri: '/test/c.js',
        lineText: 'test-3',
        startOffset: 0,
        endOffset: 0,
      },
    ]
  },
}

export const activate = () => {
  vscode.registerReferenceProvider(referenceProvider)
}
