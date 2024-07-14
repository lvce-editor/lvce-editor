const organizeImports = {
  kind: 'source.organizeImports', // TODO use numeric code action type
  name: 'Organize Imports',
  async execute(textDocument) {
    const edits = [
      {
        startOffset: 0,
        endOffset: 27,
        inserted: "import { a } from './a.ts'\nimport { b } from './b.ts'\n",
      },
      {
        startOffset: 27,
        endOffset: 54,
        inserted: '',
      },
    ]
    return edits
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
