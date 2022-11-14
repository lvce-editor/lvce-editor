const tabCompletionProvider = {
  languageId: 'xyz',
  provideTabCompletion(textDocument, offset) {
    return {
      offset: 0,
      inserted: '<h1>$0</h1>',
      deleted: 2,
      type: /* Snippet */ 2,
    }
  },
}
export const activate = () => {
  vscode.registerTabCompletionProvider(tabCompletionProvider)
}
