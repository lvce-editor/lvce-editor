const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    return ``
  },
}

export const activate = () => {
  vscode.registerFormattingProvider(formattingProvider)
}
