const completionProvider = {
  languageId: 'xyz',
  provideCompletions(textDocument, offset) {
    return [undefined]
  },
}

export const activate = () => {
  vscode.registerCompletionProvider(completionProvider)
}
