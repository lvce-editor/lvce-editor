const referenceProvider = {
  languageId: 'xyz',
  provideReferences(textDocument, offset) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerReferenceProvider(referenceProvider)
}
