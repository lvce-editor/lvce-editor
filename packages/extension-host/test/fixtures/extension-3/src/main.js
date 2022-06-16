export const activate = () => {
  vscode.registerTabCompletionProvider({
    languageId: 'html',
    provideTabCompletion() {
      return {
        inserted: '<div></div>',
        deleted: 0,
        type: /* Snippet */ 2,
      }
    },
  })
}
