const typeDefinitionProvider = {
  languageId: 'xyz',
  provideTypeDefinition(textDocument, offset) {
    return undefined
  },
}

export const activate = () => {
  vscode.registerTypeDefinitionProvider(typeDefinitionProvider)
}
