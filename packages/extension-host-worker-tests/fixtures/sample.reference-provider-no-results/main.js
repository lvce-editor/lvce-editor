const referenceProvider = {
  languageId: 'xyz',
  provideReferences(textDocument, offset) {
    return []
  },
}

export const activate = () => {
  vscode.registerReferenceProvider(referenceProvider)
}
