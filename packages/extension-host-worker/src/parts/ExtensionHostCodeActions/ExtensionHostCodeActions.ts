import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'
import * as ExtensionHostTextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

const { registerCodeActionProvider, executeCodeActionProvider } = Registry.create({
  name: 'CodeAction',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
})

export { registerCodeActionProvider, executeCodeActionProvider }

const isOrganizeImports = (action) => {
  return action.kind === 'source.organizeImports'
}

// TODO handle case when multiple organize imports providers are registered
export const executeOrganizeImports = async (uid) => {
  const actions = await executeCodeActionProvider(uid)
  // @ts-ignore
  if (!actions || actions.length === 0) {
    return []
  }
  // @ts-ignore
  const organizeImportsAction = actions.find(isOrganizeImports)
  if (!organizeImportsAction) {
    return []
  }
  const textDocument = ExtensionHostTextDocument.get(uid)
  const edits = await organizeImportsAction.execute(textDocument)
  return edits
}
