const typeDefinitionProvider = {
  languageId: 'xyz',
  provideTypeDefinition(textDocument, offset) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerTypeDefinitionProvider(typeDefinitionProvider)
}
