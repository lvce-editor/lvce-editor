const referenceProvider = {
  languageId: 'javascript',
  provideReferences(textDocument, offset) {
    console.log('execute reference provider')
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerReferenceProvider(referenceProvider)
}
