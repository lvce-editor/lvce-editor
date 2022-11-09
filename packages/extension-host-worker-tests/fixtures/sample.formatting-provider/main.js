const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    const text = textDocument.lines.join('\n')
    return text.replaceAll('a', 'b')
  },
}

export const activate = () => {
  vscode.registerFormattingProvider(formattingProvider)
}
