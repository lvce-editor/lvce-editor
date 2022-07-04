const referenceProvider = {
  languageId: 'javascript',
  provideReferences(textDocument, offset) {
    return []
  },
}

export const activate = () => {
  vscode.registerReferenceProvider(referenceProvider)
}
