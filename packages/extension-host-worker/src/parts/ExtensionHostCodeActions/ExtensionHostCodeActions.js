import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

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

export const executeOrganizeImports = (textDocument, offset) => {
  console.log('organize imports 2')
  // TODO
  // 1. find registered organizeImport code action
  // 2. execute action
  // 3. return edits
  const edits = []
  return edits
}
