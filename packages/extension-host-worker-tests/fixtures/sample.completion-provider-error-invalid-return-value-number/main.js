const completionProvider = {
  languageId: 'xyz',
  provideCompletions(textDocument, offset) {
    return 42
  },
}

export const activate = () => {
  vscode.registerCompletionProvider(completionProvider)
}
