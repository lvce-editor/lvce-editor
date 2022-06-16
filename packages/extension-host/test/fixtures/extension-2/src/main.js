export const activate = () => {
  vscode.registerTabCompletionProvider({
    languageId: 'html',
    provideTabCompletion() {
      throw new Error('some error')
    },
  })
}
