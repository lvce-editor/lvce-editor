const tabCompletionProvider = {
  languageId: 'xyz',
  provideTabCompletion(textDocument, offset) {
    return 42
  },
}
export const activate = () => {
  vscode.registerTabCompletionProvider(tabCompletionProvider)
}
