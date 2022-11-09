const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    const { text } = textDocument
    return text.replaceAll('a', 'b')
  },
}

export const activate = () => {
  vscode.registerFormattingProvider(formattingProvider)
}
