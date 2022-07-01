const typeDefinitionProvider = {
  languageId: 'javascript',
  provideDefinition(textDocument, offset) {
    return {}
  },
}

export const activate = () => {
  vscode.registerTypeDefinitionProvider(typeDefinitionProvider)
}
