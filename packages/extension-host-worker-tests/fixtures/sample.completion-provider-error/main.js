const completionProvider = {
  languageId: 'test',
  provideCompletions(textDocument, offset) {
    throw new Error('oops')
  },
}
export const activate = () => {
  vscode.registerCompletionProvider(completionProvider)
}
