const typeDefinitionProvider = {
  languageId: 'javascript',
}

export const activate = () => {
  vscode.registerTypeDefinitionProvider(typeDefinitionProvider)
}
