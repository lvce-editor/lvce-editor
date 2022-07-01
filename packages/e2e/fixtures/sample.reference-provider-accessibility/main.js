const referenceProvider = {
  languageId: 'javascript',
  provideReferences(textDocument, offset) {
    return [
      {
        uri: '/test/index.js',
        lineText: 'test',
        startOffset: 0,
        endOffset: 0,
      },
    ]
  },
}

export const activate = () => {
  vscode.registerReferenceProvider(referenceProvider)
}
