const completionProvider = {
  languageId: 'xyz',
  provideCompletions(textDocument, offset) {
    throw new Error('oops')
  },
}
export const activate = () => {
  vscode.registerCompletionProvider(completionProvider)
}
