const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    return [
      {
        startOffset: 3,
        endOffset: 5,
        inserted: '',
      },
      {
        startOffset: 4,
        endOffset: 34,
        inserted: '\n',
      },
    ]
  },
}

export const activate = () => {
  vscode.registerFormattingProvider(formattingProvider)
}
