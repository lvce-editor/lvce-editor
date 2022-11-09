const formattingProvider = {
  languageId: 'xyz',
  format(textDocument, offset) {
    throw new Error('oops')
  },
}

export const activate = () => {
  console.log('active formatt')
  vscode.registerFormattingProvider(formattingProvider)
}
