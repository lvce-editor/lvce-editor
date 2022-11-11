const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    const { text } = textDocument
    const formatted = text.replaceAll('a', 'b')
    if (text === formatted) {
      return []
    }
    return [
      {
        startOffset: 0,
        endOffset: text.length,
        inserted: formatted,
      },
    ]
  },
}

export const activate = () => {
  vscode.registerFormattingProvider(formattingProvider)
}
