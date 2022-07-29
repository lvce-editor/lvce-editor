const braceCompletionProvider = {
  languageId: 'xyz',
  provideBraceCompletion(textDocument, offset) {
    throw new Error('oops')
  },
}
export const activate = () => {
  vscode.registerBraceCompletionProcider(braceCompletionProvider)
}
