import * as EditorStrings from '../EditorStrings/EditorStrings.js'

export const getEditorSourceActions = async () => {
  const sourceActions = [
    {
      name: EditorStrings.organizeImports(),
    },
    {
      name: EditorStrings.sortImports(),
    },
  ]
  return sourceActions
}
