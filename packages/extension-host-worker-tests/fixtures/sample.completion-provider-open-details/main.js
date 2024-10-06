const getCompletions = (text, offset) => {
  return [
    {
      label: 'Option A',
      snippet: `Option A`,
      kind: vscode.EditorCompletionType.Property,
    },
    {
      label: 'Option B',
      snippet: `Option B`,
      kind: vscode.EditorCompletionType.Value,
    },
    {
      label: 'Option C',
      snippet: `Option C`,
      kind: vscode.EditorCompletionType.Function,
    },
  ]
}

const completionProvider = {
  languageId: 'xyz',
  provideCompletions(textDocument, offset) {
    const text = vscode.getTextFromTextDocument(textDocument)
    return getCompletions(text, offset)
  },
}

export const activate = () => {
  vscode.registerCompletionProvider(completionProvider)
}
