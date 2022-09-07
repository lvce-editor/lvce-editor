const definitionProvider = {
  languageId: 'xyz',
  provideDefinition(textDocument, offset) {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerDefinitionProvider(definitionProvider)
}
