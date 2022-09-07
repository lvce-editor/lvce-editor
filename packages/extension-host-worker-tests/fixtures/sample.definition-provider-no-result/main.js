const definitionProvider = {
  languageId: 'xyz',
  provideDefinition(textDocument, offset) {
    return undefined
  },
}

export const activate = () => {
  vscode.registerDefinitionProvider(definitionProvider)
}
