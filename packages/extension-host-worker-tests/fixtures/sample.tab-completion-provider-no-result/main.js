const tabCompletionProvider = {
  languageId: 'xyz',
  provideTabCompletion(textDocument, offset) {
    return undefined
  },
}
export const activate = () => {
  vscode.registerTabCompletionProvider(tabCompletionProvider)
}
