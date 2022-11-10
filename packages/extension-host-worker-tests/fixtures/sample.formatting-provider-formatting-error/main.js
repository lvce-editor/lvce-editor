const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    throw new vscode.FormattingError('oops')
  },
}

export const activate = () => {
  vscode.registerFormattingProvider(formattingProvider)
}
