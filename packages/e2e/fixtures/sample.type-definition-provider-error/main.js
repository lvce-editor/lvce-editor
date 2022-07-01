const typeDefinitionProvider = {
  languageId: 'javascript',
  provideTypeDefinition(textDocument, offset) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerTypeDefinitionProvider(typeDefinitionProvider)
}
