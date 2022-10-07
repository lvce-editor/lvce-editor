const getCompletions = (text, offset) => {
  return [
    {
      label: 'Option A',
      snippet: `Option A`,
      kind: /*  */ 1,
    },
    {
      label: 'Option B',
      snippet: `Option B`,
      kind: /*  */ 2,
    },
    {
      label: 'Option C',
      snippet: `Option C`,
      kind: /*  */ 3,
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
