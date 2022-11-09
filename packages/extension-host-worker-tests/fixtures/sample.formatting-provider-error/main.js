const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerFormattingProvider(formattingProvider)
}
