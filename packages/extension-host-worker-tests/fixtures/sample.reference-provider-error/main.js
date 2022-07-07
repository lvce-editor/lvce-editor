const referenceProvider = {
  languageId: 'javascript',
  provideReferences(textDocument, offset) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerReferenceProvider(referenceProvider)
}
