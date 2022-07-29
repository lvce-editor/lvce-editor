const tabCompletionProvider = {
  languageId: 'xyz',
  provideTabCompletion(textDocument, offset) {
    return {
      offset: 0,
      inserted: 'test',
      deleted: 1,
      type: /* Snippet */ 2,
    }
  },
}
export const activate = () => {
  vscode.registerTabCompletionProvider(tabCompletionProvider)
}
