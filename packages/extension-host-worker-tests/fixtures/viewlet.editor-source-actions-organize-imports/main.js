const organizeImports = {
  kind: 'source.organizeImports', // TODO use numeric code action type
  name: 'Organize Imports',
  async execute(textDocument) {
    console.log({ textDocument })
    return undefined
  },
}

const codeActionsProvider = {
  languageId: 'xyz',
  provideCodeActions(textDocument, offset) {
    return [organizeImports]
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerCodeActionsProvider(codeActionsProvider)
}
