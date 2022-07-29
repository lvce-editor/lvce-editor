const braceCompletionProvider = {
  languageId: 'xyz',
  provideBraceCompletion(textDocument, offset) {
    return true
  },
}
export const activate = () => {
  vscode.registerBraceCompletionProvider(braceCompletionProvider)
}
