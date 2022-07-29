const tabCompletionProvider = {
  languageId: 'xyz',
  provideTabCompletion(textDocument, offset) {
    throw new Error('oops')
  },
}
export const activate = () => {
  vscode.registerTabCompletionProvider(tabCompletionProvider)
}
